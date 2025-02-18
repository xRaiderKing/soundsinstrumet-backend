import OrdenProducto from "../models/OrdenCliente.js"; // Usar el nombre correcto del archivo

class Respuesta {
    status = '';
    msg = '';
    data = null;
}

// Controlador para listar todos los productos comprados por un cliente
const ordenCliente = async (req, res) => {
    let respuesta = new Respuesta();
    try {
        // Obtener el ID del cliente desde el token de autenticación
        const clienteId = req.usuario._id;
        console.log(clienteId);

        // Buscar todas las órdenes del cliente
        const ordenes = await OrdenProducto.find({ 'cliente.clienteId': clienteId }).populate('productos.productoId');

        // Si no hay órdenes, devolver un mensaje
        if (ordenes.length === 0) {
            respuesta.status = 'error';
            respuesta.msg = "No se encontraron productos comprados por este cliente.";
            return res.json(respuesta);
        }

        // Extraer los productos de las órdenes
        /* const productosComprados = ordenes.flatMap(orden =>
            orden.productos.map(producto => ({
                nombre: producto.productoId.nombre,
                cantidad: producto.cantidad,
                precio: producto.precio
            }))
        ); */

        // Devolver la lista de productos comprados
        respuesta.status = 'success';
        respuesta.msg = "Productos comprados encontrados.";
        respuesta.data = ordenes;
        res.json(respuesta);
    } catch (error) {
        respuesta.status = 'error';
        respuesta.msg = "Hubo un error al obtener los productos.";
        respuesta.data = { error: error.message };
        res.status(500).json(respuesta);
    }
};

const ordenesClientes = async (req, res) => {
    let respuesta = new Respuesta();
    try {
        // Obtener el ID del cliente desde el token de autenticación
        const clienteId = req.usuario._id;

        // Obtener los filtros enviados desde el cuerpo de la solicitud
        const { creadoEn, precioMin, precioMax, nombre } = req.body;

        // Construir un objeto de filtros dinámico (inicialmente vacío)
        const filtros = {};

        // Filtrar por fecha si se proporciona
        if (creadoEn) {
            const fechaInicio = new Date(creadoEn);
            const fechaFin = new Date(creadoEn);
            fechaFin.setDate(fechaFin.getDate() + 1); // Incluye todo el día
            filtros.creadoEn = { $gte: fechaInicio, $lt: fechaFin };
        }

        // Filtrar por total mínimo y máximo
        if (precioMin || precioMax) {
            filtros.total = {};
            if (precioMin) filtros.total.$gte = parseFloat(precioMin);
            if (precioMax) filtros.total.$lte = parseFloat(precioMax);
        }

        // Filtrar por nombre del producto
        if (nombre) {
            filtros["productos.nombre"] = { $regex: nombre, $options: "i" }; // Búsqueda insensible a mayúsculas
        }

        // Buscar órdenes del cliente aplicando los filtros (o sin filtros)
        const ordenes = await OrdenProducto.find(filtros).populate('productos.productoId');

        // Si no hay órdenes, devolver un mensaje
        if (ordenes.length === 0) {
            respuesta.status = 'error';
            respuesta.msg = "No se encontraron reportes de venta.";
            return res.json(respuesta);
        }

        // Devolver la lista de órdenes (filtradas o completas)
        respuesta.status = 'success';
        respuesta.msg = "Productos comprados encontrados.";
        respuesta.data = ordenes;
        res.json(respuesta);
    } catch (error) {
        respuesta.status = 'error';
        respuesta.msg = "Hubo un error al obtener los productos.";
        respuesta.data = { error: error.message };
        res.status(500).json(respuesta);
    }
};


export { ordenCliente,ordenesClientes };
