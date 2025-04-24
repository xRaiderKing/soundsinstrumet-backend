// ## MAiltrap para testear envio de emails

import nodemailer from "nodemailer";

export const emailResgistro = async (datos) => {
  const { email, nombre, token } = datos;

  // configurar cliente para enviar email
  let transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // Informacion del email
  const info = await transport.sendMail({
    from: '"SoundTain-Instruments - Venta de Instrumentos Musicales" <cuentas@soundtain.com>',
    to: email,
    subject: "🎶 Confirma tu cuenta en SoundTain-Instruments",
    text: "Confirma tu cuenta en SoundTain-Instruments",
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <h2 style="color: #2c3e50; text-align: center;">🎸 SoundTain-Instruments</h2>
          <p style="font-size: 16px; color: #333;">Hola <strong>${nombre}</strong>,</p>
          <p style="font-size: 16px; color: #333;">
            ¡Gracias por registrarte en <strong>SoundTain-Instruments</strong>! Tu cuenta está casi lista.
            Solo debes confirmarla haciendo clic en el botón siguiente:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}:${process.env.PORTF}/auth/confirmar/${token}" 
              style="background-color: #3498db; color: white; padding: 12px 20px; border-radius: 6px; text-decoration: none; font-weight: bold;">
              Confirmar Cuenta
            </a>
          </div>
          <p style="font-size: 14px; color: #666;">
            Si tú no creaste esta cuenta, puedes ignorar este mensaje sin problemas.
          </p>
          <hr style="margin: 30px 0;">
          <p style="font-size: 12px; color: #999; text-align: center;">
            SoundTain-Instruments | Venta de Instrumentos Musicales
          </p>
        </div>
      </div>
    `
  });
  
  //console.log(datos);
};

export const emailOlvidePassw = async (datos) => {
  const { email, nombre, token } = datos;

  // configurar cliente para enviar email
  let transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // Informacion del email
  const info = await transport.sendMail({
    from: '"SoundTain-Instruments - Venta de Instrumentos Musicales" <cuentas@soundtain.com>',
    to: email,
    subject: "🔒 SoundTain-Instruments - Restablecer Contraseña",
    text: "Restablece tu contraseña",
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f8f8f8; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <h2 style="color: #2c3e50; text-align: center;">🔒 Restablecimiento de Contraseña</h2>
          <p style="font-size: 16px; color: #333;">Hola <strong>${nombre}</strong>,</p>
          <p style="font-size: 16px; color: #333;">
            Has solicitado restablecer tu contraseña para tu cuenta en <strong>SoundTain-Instruments</strong>.
          </p>
          <p style="font-size: 16px; color: #333;">
            Para continuar, haz clic en el siguiente botón y crea una nueva contraseña:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}:${process.env.PORTF}/auth/nueva-pass/${token}" 
              style="background-color: #e74c3c; color: white; padding: 12px 20px; border-radius: 6px; text-decoration: none; font-weight: bold;">
              Restablecer Contraseña
            </a>
          </div>
          <p style="font-size: 14px; color: #666;">
            Si tú no solicitaste este cambio, puedes ignorar este mensaje. Tu cuenta está segura.
          </p>
          <hr style="margin: 30px 0;">
          <p style="font-size: 12px; color: #999; text-align: center;">
            SoundTain-Instruments | Venta de Instrumentos Musicales
          </p>
        </div>
      </div>
    `
  });
  

  //console.log(datos);
};


export const emailDetalleVenta = async (orden) => {
  const { productos, estado, total, cliente } = orden;

  let transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // Informacion del email
  let fecha = new Date();
  let prods = ``;
  prods = productos.map(producto => `
    
    <pre>Nombre: ${producto.nombre}</pre>
    <pre>Descripción: ${producto.descripcion}</pre>
    <pre>Cantidad: ${producto.cantidad}</pre>
    <pre>Precio: $${producto.precio.toFixed(2)}</pre>
    <pre>Subtotal: $${(producto.cantidad * producto.precio).toFixed(2)}</pre>
    
    `);


  console.log(productos);
  //console.log(productos);
  console.log(prods);

  const info = await transport.sendMail({
    from: '"SoundTain-Instruments - Venta de Instrumentos Musicales" <cuentas@soundtain.com>',
    to: cliente.email,
    subject: "🧾 SoundTain-Instruments - Detalle de tu Compra",
    text: "Su pago se realizó con éxito. Aquí encontrarás el detalle de la venta.",
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f8f9fa; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <h2 style="color: #2c3e50; text-align: center;">🎉 ¡Gracias por tu compra, ${cliente.nombre}!</h2>
          <p style="font-size: 16px; color: #333;">Hemos recibido tu pago con éxito. Aquí tienes el detalle de tu pedido:</p>
  
          <h3 style="color: #e67e22;">🛒 Productos comprados:</h3>
          <ul style="font-size: 15px; color: #333; padding-left: 20px;">
            ${prods}
          </ul>
  
          <h3 style="color: #2980b9;">💰 Total:</h3>
          <p style="font-size: 16px; font-weight: bold; color: #27ae60;">${total}</p>
  
          <h3 style="color: #2980b9;">📌 Estado de Pago:</h3>
          <p style="font-size: 15px; color: #333;">${estado}</p>
  
          <h3 style="color: #2980b9;">🗓️ Fecha de Compra:</h3>
          <p style="font-size: 15px; color: #333;">${fecha}</p>
  
          <hr style="margin: 30px 0;">
          <p style="font-size: 14px; color: #666;">Este correo es tu comprobante de compra. Si tienes alguna duda, contáctanos a <a href="mailto:cuentas@soundtain.com">cuentas@soundtain.com</a>.</p>
          <p style="font-size: 12px; color: #999; text-align: center;">SoundTain-Instruments | Venta de Instrumentos Musicales</p>
        </div>
      </div>
    `
  });
  

};

export const emailDescuento = async (datos) => {
  const { email, nombre, descuento } = datos;

  // configurar cliente para enviar email
  let transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // Informacion del email
  const info = await transport.sendMail({
    from: '"SoundTain-Instruments - Venta de Instrumentos Musicales" <cuentas@soundtain.com>',
    to: email,
    subject: "SoundTain-Instruments - Felicidades",
    text: "Descuentos en SoundTain-Instruments",
    html:
      `
        <p>Hola, ${nombre} el día de hoy has sido el afortunado de obtener un descuento del ${(descuento*100)}% en nuestra tienda.</p>
        <p>Para utilizarlo, puedes ingresar a nuestro sitio oficial o dar click en el siguiente enlace: </p>
        <a href="${process.env.FRONTEND_URL}:${process.env.PORTF}/clientes" >Relizar Compras</a>
        
        <p>Si quieres, puedes ignorar este mensaje</p>
        `
  });

  //console.log(datos);
};
