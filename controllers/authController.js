import Cliente from "../models/Cliente.js";

import { check, validationResult } from "express-validator";
import generarId from "../helpers/generarId.js"
import { emailOlvidePassw, emailResgistro } from "../helpers/email.js";
import generarJWT from "../helpers/generarJWT.js";
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import sanitize from 'mongo-sanitize';


class Respuesta {
    status = '';
    msg = '';
    data = null;
}

const tempStorage = {
    users: {},
    verificationCodes: {}
}


const MAX_INTENTOS = 5;
const BLOQUEO_MINUTOS = 10;

// configurar cliente para enviar email
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: "jesusyaelpadrongrimaldo@gmail.com",
      pass: "feno iusi niqs pnca"
    }
  });

  function generateVerificationCode() {
    return crypto.randomInt(100000, 999999).toString();
}


//Funcion para iniciar sesión
const login = async (req, res, next) => {
    let respuesta = new Respuesta();
    const { email, pass } = sanitize(req.body);

    try {
        await check('email').notEmpty().withMessage('Email Obligatorio').run(req);
        await check('pass').notEmpty().withMessage('Password Obligatorio').run(req);

        let resultdado = validationResult(req);

        if (!resultdado.isEmpty()) {
            respuesta.status = 'error';
            respuesta.msg = 'Se encontraron mensajes de error';
            respuesta.data = resultdado.array();
            return res.json(respuesta);
        }

        const cliente = await Cliente.findOne({ email });
        cliente.actualizarUltimaActividad();

        if (!cliente) {
            respuesta.status = 'error';
            respuesta.msg = 'Usuario no encontrado';
            respuesta.data = null;
            return res.json(respuesta);
        }

        if (!cliente.confirmado) {
            respuesta.status = 'error';
            respuesta.msg = 'Tu cuenta no ha sido confirmada';
            respuesta.data = null;
            return res.json(respuesta);
        }

        // Verificar si está bloqueado
        if (cliente.bloqueadoHasta && cliente.bloqueadoHasta > new Date()) {
            respuesta.status = 'error';
            respuesta.msg = 'Cuenta bloqueada temporalmente. Intenta más tarde.';
            return res.status(403).json(respuesta);
        }

        const cl = await cliente.comprobarPass(pass);

        if (!cl) {
            cliente.intentosFallidos += 1;

            if (cliente.intentosFallidos >= MAX_INTENTOS) {
                cliente.bloqueadoHasta = new Date(Date.now() + BLOQUEO_MINUTOS * 60000);
                await cliente.save();
                respuesta.status = 'error';
                respuesta.msg = `Demasiados intentos fallidos. Cuenta bloqueada por ${BLOQUEO_MINUTOS} minutos.`;
                return res.status(403).json(respuesta);
            }

            respuesta.status = 'error';
            respuesta.msg = 'Contraseña incorrecta';
            respuesta.data = null;
            return res.json(respuesta);
        }

        // Si el login fue exitoso: resetear contador
        cliente.intentosFallidos = 0;
        cliente.bloqueadoHasta = null;
        await cliente.save();

        // Generar código de verificación
        const verificationCode = generateVerificationCode();
        tempStorage.verificationCodes[email] = verificationCode;

        // Configurar el correo electrónico
        const mailOptions = {
            from: '"SoundTain-Instruments - Venta de Instrumentos Musicales" <cuentas@soundtain.com>',
            to: email,
            subject: '📩 Tu código de verificación - SoundTain-Instruments',
            text: `Tu código de verificación es: ${verificationCode}`,
            html: `
              <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                <div style="max-width: 600px; margin: auto; background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                  <h2 style="color: #2c3e50; text-align: center;">🔐 Código de Verificación</h2>
                  <p style="font-size: 16px; color: #333;">Hola,</p>
                  <p style="font-size: 16px; color: #333;">
                    Hemos recibido una solicitud para verificar tu cuenta en <strong>SoundTain-Instruments</strong>.
                  </p>
                  <p style="font-size: 16px; color: #333;">Tu código de verificación es:</p>
                  <div style="text-align: center; margin: 30px 0;">
                    <span style="display: inline-block; background-color: #3498db; color: white; padding: 15px 25px; font-size: 20px; border-radius: 8px; letter-spacing: 2px;">
                      ${verificationCode}
                    </span>
                  </div>
                  <p style="font-size: 14px; color: #666;">
                    Si tú no solicitaste este código, puedes ignorar este mensaje. Tu cuenta está segura.
                  </p>
                  <hr style="margin: 30px 0;">
                  <p style="font-size: 12px; color: #999; text-align: center;">
                    SoundTain-Instruments | Venta de Instrumentos Musicales
                  </p>
                </div>
              </div>
            `
          };

        // Enviar correo de forma asíncrona
        await transporter.sendMail(mailOptions);
        
        console.log('Email enviado');
        
        // Respuesta indicando que se necesita verificación
        respuesta.status = 'success';
        respuesta.msg = 'Código de verificación enviado';
        respuesta.data = { requiresVerification: true };
        return res.json(respuesta);

    } catch (error) {
        console.error('Error en login:', error); // Log detallado del error
        respuesta.status = 'error';
        respuesta.msg = 'Error en el servidor';
        respuesta.data = error.message; // Puedes enviar el mensaje de error para debugging
        return res.status(500).json(respuesta);
    }
};

// Ruta para verificar el código (segundo paso)
const verify = async (req, res, next) => {
    let respuesta = new Respuesta();
    const { email, code } = req.body;
    
    try {
        const storedCode = tempStorage.verificationCodes[email];
        
        if (storedCode && storedCode === code) {
            delete tempStorage.verificationCodes[email];
            
            // Aquí generas el JWT solo después de verificar el código
            const cliente = await Cliente.findOne({ email });
            const jwtkn = generarJWT(cliente._id);
            
            respuesta.status = 'success';
            respuesta.msg = 'Verificación exitosa';
            respuesta.data = { 
                rol: cliente.rol, 
                tkn: jwtkn 
            };
            return res.json(respuesta);
        } else {
            respuesta.status = 'error';
            respuesta.msg = 'Código de verificación incorrecto';
            return res.status(401).json(respuesta);
        }
    } catch (error) {
        console.error('Error en verify:', error);
        respuesta.status = 'error';
        respuesta.msg = 'Error en el servidor';
        respuesta.data = error.message;
        return res.status(500).json(respuesta);
    }
};

//Funcion para registrar nuevos clientes
const registro = async (req, res, next) => {
    let respuesta = new Respuesta();
    //parsear datos
    const cliente = new Cliente(req.body);
    try {
        //validación
        await check('nombre').notEmpty().withMessage('El nombre no puede ir vacío').run(req);
        await check('apellido').notEmpty().withMessage('El apellido no puede ir vacío').run(req);
        await check('email').isEmail().withMessage('Esto no parece un email').run(req);
        await check('pass').isLength({ min: 6 }).withMessage('La contraseña debe ser de mínimo 6 caracteres').run(req);

        let resultdado = validationResult(req);

        // Verificar que no haya errores
        if (!resultdado.isEmpty()) {
            // Mostrar Errores
            respuesta.status = 'error';
            respuesta.msg = 'Se encontraron mensajes de error';
            respuesta.data = resultdado.array();
            return res.json(respuesta);
        }

        // Evitar usuarios duplicados
        const exists = await Cliente.findOne({ 'email': req.body.email })
        //console.log(exists);
        if (exists) {
            respuesta.status = 'error';
            respuesta.msg = 'El email ya se encuentra registrado';
            respuesta.data = null;
            return res.json(respuesta);
        }

        // Almacenar registro si no hay erroe¿res
        cliente.token = generarId();

        // Enviar el email de confirmación
        emailResgistro({
            email: cliente.email,
            nombre: cliente.nombre,
            token: cliente.token
        });

        await cliente.save();
        // no hay err
        respuesta.status = 'succes';
        respuesta.msg = 'Usuario Creado Correctamente, Revisa tu Email para Confirmar tu cuenta';
        respuesta.data = null;
        return res.json(respuesta);

    } catch (error) {
        respuesta.status = 'error';
        respuesta.msg = 'Error al guardar en el servidor';
        respuesta.data = null;
        return res.json(respuesta);
    }

};

// Función para confirmar una cuenta
const confirmar = async (req, res, next) => {
    let respuesta = new Respuesta();
    const { tkn } = req.params;
    try {
        const clienteConfirmar = await Cliente.findOne({ token: tkn });
        clienteConfirmar.confirmado = true;
        clienteConfirmar.token = "";
        await clienteConfirmar.save();
        //console.log(clienteConfirmar);
        respuesta.status = 'succes';
        respuesta.msg = 'Usuario Confirmado Correctamente';
        respuesta.data = null;
        return res.json(respuesta);

    } catch (error) {
        respuesta.status = 'error';
        respuesta.msg = 'Token no válido';
        respuesta.data = null;
        return res.json(respuesta);
    };
}

//Funcion para recuperar contraseña
const resetPasswd = async (req, res, next) => {
    const { email } = req.body;
    let respuesta = new Respuesta();

    try {
        //validación email
        await check('email').notEmpty().withMessage('Correo Obligatorio').run(req);

        let resultdado = validationResult(req);

        // Verificar que no haya errores
        if (!resultdado.isEmpty()) {
            // Mostrar Errores
            respuesta.status = 'error';
            respuesta.msg = 'Se encontraron mensajes de error';
            respuesta.data = resultdado.array();
            return res.json(respuesta);
        }

        // Buscar usuario
        const existsClient = await Cliente.findOne({ 'email': email })

        if (!existsClient) {
            respuesta.status = 'error';
            respuesta.msg = 'No existe el usuario';
            respuesta.data = null;
            return res.json(respuesta);
        }


        // Generar token y enviar email
        existsClient.token = generarId();

        // Enviar el email de confirmación
        emailOlvidePassw({
            email: existsClient.email,
            nombre: existsClient.nombre,
            token: existsClient.token
        });

        await existsClient.save();

        //sin errores
        respuesta.status = 'succes';
        respuesta.msg = 'Hemos enviado un email con las instrucciones';
        respuesta.data = null;
        return res.json(respuesta);

    } catch (error) {
        // Atrapar error
        respuesta.status = 'error';
        respuesta.msg = 'Error en el servidor';
        respuesta.data = null;
        return res.json(respuesta);
    }
}


/**
 * Funcion para validar el token de cambio 
 * de contraseña.
 */
const comprobarToken = async (req, res) => {
    let respuesta = new Respuesta();

    const { tkn } = req.params;
    const existCliente = await Cliente.findOne({ token: tkn });
    if (existCliente) {
        respuesta.status = 'succes';
        respuesta.msg = 'Usuario exitente && token válido';
        respuesta.data = null;
        return res.json(respuesta);
        //res.json({ msg: "Usuario exitente && token válido", valid: true });
    } else {
        respuesta.status = 'error';
        respuesta.msg = 'Token no válido';
        respuesta.data = null;
        return res.json(respuesta);
        //res.status(404).json({ msg: error.message, valid: false });
    };
}

/**
 * Funcion para cambiar el password de 
 * un usuario
 */
const cambiarPass = async (req, res, next) => {
    let respuesta = new Respuesta();

    const { tkn } = req.params;
    const { pass } = req.body;
    try {
        //validación
        await check('pass').isLength({ min: 6 }).withMessage('La contraseña debe ser de mínimo 6 caracteres').run(req);

        let resultdado = validationResult(req);

        // Verificar que no haya errores
        if (!resultdado.isEmpty()) {
            // imprimir errores
            respuesta.status = 'error';
            respuesta.msg = 'Se encontraron mensajes de error';
            respuesta.data = resultdado.array();
            return res.json(respuesta);
        }

        // Ver que usuario va a realizar el cambio
        const existsClient = await Cliente.findOne({ token: tkn });
        //console.log(exists);

        //nuevo pass
        existsClient.pass = pass;
        existsClient.token = '';
        await existsClient.save();
        //sin err
        respuesta.status = 'succes';
        respuesta.msg = 'Nueva contraseña guardada exitosamente';
        respuesta.data = null;
        return res.json(respuesta);
    } catch (error) {
        // Atrapar error
        respuesta.status = 'error';
        respuesta.msg = 'Token no válido';
        respuesta.data = null;
        return res.json(respuesta);
    }
}

const logOut = async (req, res, next) => {
    req.cookies = null;
}

const obtenerPerfil = async (req, res, next) => {
    let respuesta = new Respuesta();

    try {
        if (!req.usuario) {
            respuesta.status = 'error';
            respuesta.msg = 'No autenticado';
            respuesta.data = null;
            return res.status(401).json(respuesta);
        }

        // Enviar la información del perfil del usuario
        respuesta.status = 'success';
        respuesta.msg = 'Perfil obtenido correctamente';
        respuesta.data = {
            _id: req.usuario._id,
            nombre: req.usuario.nombre,
            apellido: req.usuario.apellido,
            direccion: req.usuario.direccion,
            email: req.usuario.email,
            phone: req.usuario.phone,
            descuento: req.usuario.descuento
        };
        return res.json(respuesta);

    } catch (error) {
        respuesta.status = 'error';
        respuesta.msg = 'Error al obtener el perfil';
        respuesta.data = null;
        return res.json(respuesta);
    }
};

const notifyRecibed = async (req, res, next) => {
    let respuesta = new Respuesta();
    console.log('No notifiy');
    const { _id } = req.usuario;

    const user = await Cliente.findOne({_id});

    user.actualizarCheckNotify();
    respuesta.status = 'success';
    respuesta.msg = 'Notificación vista';
    respuesta.data = null;
    return res.json(respuesta);
}

const updateLastActivity = () => {

}


export {
    login,
    verify,
    registro,
    confirmar,
    resetPasswd,
    comprobarToken,
    cambiarPass,
    logOut,
    obtenerPerfil,
    notifyRecibed
}