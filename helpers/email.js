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
    subject: "SoundTain-Instruments - Confirma tu cuenta",
    text: "Confirma tu cuenta en SoundTain-Instruments",
    html:
      `
        <p>Hola, ${nombre} confirma tu cuenta en SoundTain-Instruments</p>
        <p>Tu cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlace: </p>
        <a href="${process.env.FRONTEND_URL}:${process.env.PORTF}/auth/confirmar/${token}" >Comprobar Cuenta</a>
        
        <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
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
    subject: "SoundTain-Instruments - Reestablecer Contraseña",
    text: "Reestablece tu contraseña",
    html:
      `
      <p>Hola, ${nombre} has solicitado reestablecer tu contraseña</p>
      <p>Sigue el siguiente enlace para generar una nueva contraseña: </p>
      <a href="${process.env.FRONTEND_URL}:${process.env.PORTF}/auth/nueva-pass/${token}" >Reestablecer Contraseña</a>
      <p>Si tu no solicitaste el cambio de contraseña, puedes ignorar este mensaje</p>
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
    subject: "SoundTain-Instruments - Detalle de Venta",
    text: "Su pago se realizó con exito, aqui encontrarás el detalle de la venta.",
    html:
      `
      <p>Hola, ${cliente.nombre} has comprado los siguientes articulos:</p>
      <p>Productos:</p>prods
      <p>${prods}</p>
      <p>Total:</p>
      <pre>${total}</pre>
      <p>Estado de pago:</p>
      <pre>${estado}</pre>
      <p>Fecha de compra:</p>
      <pre>${fecha}</pre>

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
