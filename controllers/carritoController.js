import Carrito from '../models/Carrito.js'; // Asegúrate de importar correctamente el modelo Carrito
import Producto from '../models/Producto.js'; // Asegúrate de importar el modelo Producto
import  OrdenProducto  from '../models/OrdenCliente.js';
import { emailDetalleVenta } from '../helpers/email.js';
import { obtenerUrlImagen } from './productoController.js';


class Respuesta {
    status = '';
    msg = '';
    data = null;
}
// Agregar un producto al carrito
export const agregarAlCarrito = async (req, res) => {
    const { productoId, cantidad } = req.body;
    const { _id: usuarioId } = req.usuario;
    try {
        const producto = await Producto.findById(productoId);
        if (!producto) {
            return res.status(404).json({ status: 'error', msg: 'Producto no encontrado' });
        }

        let carrito = await Carrito.findOne({ usuario: usuarioId });
        if (!carrito) {
            // Crear nuevo carrito si no existe
            carrito = new Carrito({
                usuario: usuarioId,
                productos: [{ producto: productoId, cantidad, precio: producto.precio }],
                total: producto.precio * cantidad
            });
        } else {
            const productoEnCarrito = carrito.productos.find(p => p.producto.equals(productoId));
            if (productoEnCarrito) {
                productoEnCarrito.cantidad += Number(cantidad);
            } else {
                carrito.productos.push({ producto: productoId, cantidad, precio: producto.precio });
            }
            // Recalcular el total
            carrito.total = carrito.productos.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
        }

        await carrito.save();
        res.json({ status: 'success', msg: 'Producto agregado al carrito', data: carrito });
    } catch (error) {
        res.status(500).json({ status: 'error', msg: 'Error al agregar producto al carrito' });
    }
};

// Eliminar un producto del carrito
export const eliminarDelCarrito = async (req, res) => {
    const { productoId } = req.body;
    const { _id: usuarioId } = req.usuario;
    try {
        const carrito = await Carrito.findOne({ usuario: usuarioId });
        if (!carrito) {
            return res.status(404).json({ status: 'error', msg: 'Carrito no encontrado' });
        }

        carrito.productos = carrito.productos.filter(p => !p.producto.equals(productoId));
        carrito.total = carrito.productos.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

        await carrito.save();
        res.json({ status: 'success', msg: 'Producto eliminado del carrito', data: carrito });
    } catch (error) {
        res.status(500).json({ status: 'error', msg: 'Error al eliminar producto del carrito' });
    }
};

// Incrementar la cantidad de un producto en el carrito
export const incrementarCantidad = async (req, res) => {
    const { productoId } = req.body;
    const { _id: usuarioId } = req.usuario;
    try {
        const carrito = await Carrito.findOne({ usuario: usuarioId });
        if (!carrito) {
            return res.status(404).json({ status: 'error', msg: 'Carrito no encontrado' });
        }

        const productoEnCarrito = carrito.productos.find(p => p.producto.equals(productoId));
        if (productoEnCarrito && productoEnCarrito.cantidad < 5) { // Si no supera la cantidad máxima
            productoEnCarrito.cantidad += 1;
            carrito.total = carrito.productos.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
            await carrito.save();
            res.json({ status: 'success', msg: 'Cantidad incrementada', data: carrito });
        } else {
            res.status(400).json({ status: 'error', msg: 'Cantidad máxima alcanzada o producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ status: 'error', msg: 'Error al incrementar cantidad' });
    }
};

// Disminuir la cantidad de un producto en el carrito
export const decrementarCantidad = async (req, res) => {
    const { productoId } = req.body;
    const { _id: usuarioId } = req.usuario;
    try {
        const carrito = await Carrito.findOne({ usuario: usuarioId });
        if (!carrito) {
            return res.status(404).json({ status: 'error', msg: 'Carrito no encontrado' });
        }

        const productoEnCarrito = carrito.productos.find(p => p.producto.equals(productoId));
        if (productoEnCarrito && productoEnCarrito.cantidad > 1) { // Si no alcanza la cantidad mínima
            productoEnCarrito.cantidad -= 1;
            carrito.total = carrito.productos.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
            await carrito.save();
            res.json({ status: 'success', msg: 'Cantidad decrementada', data: carrito });
        } else {
            res.status(400).json({ status: 'error', msg: 'Cantidad mínima alcanzada o producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ status: 'error', msg: 'Error al decrementar cantidad' });
    }
};

export const obtenerCarrito = async (req, res) => {
    let respuesta = new Respuesta();
    try {
        const { _id: usuarioId } = req.usuario;

        // Buscar el carrito del usuario y hacer un populate de los productos
        const carrito = await Carrito.findOne({ usuario: usuarioId })
            .populate({
                path: 'productos.producto',
                select: 'nombre imagen descripcion precio'
            });

        if (!carrito) {
            respuesta.status = 'error';
            respuesta.msg = 'No se encontró el carrito para este usuario';
            return res.status(404).json(respuesta);
        }

        // Respuesta de éxito con los datos del carrito
        respuesta.status = 'success';
        respuesta.msg = 'Carrito obtenido exitosamente';

        console.log(carrito);

        carrito.productos.map(item => {
            console.log(item);
            item.producto.imagen = obtenerUrlImagen(req, item.producto.imagen);
        })

        console.log(carrito);

        respuesta.data = carrito;

        res.json(respuesta);
    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'Error al obtener el carrito';
        res.status(500).json(respuesta);
    }
};

export const realizarCompra = async (req, res) => {
    const { orden } = req.body;
    const { productos, estado, total } = orden;
    const { nombre, email, _id } = req.usuario;
    const respuesta = new Respuesta();
    
    try {
        const orden = new OrdenProducto({
            cliente: {
                clienteId: _id,
                nombre,
                email
            },
            productos,
            total,
            estado // Ajusta el estado inicial según tu lógica de negocio
        });

        // Guardar la orden en la base de datos
        const ordenGuardada = await orden.save();

        // Actualizar la cantidad de productos en el inventario
        for (const producto of productos) {
            const { productoId, cantidad } = producto; // Asegúrate de que `productoId` y `cantidad` estén en la orden
            const productoDb = await Producto.findById(productoId);
            if (!productoDb) {
                throw new Error(`El producto con ID ${productoId} no existe`);
            }
            if (productoDb.cantidad < cantidad) {
                throw new Error(`Stock insuficiente para el producto: ${productoDb.nombre}`);
            }

            // Reducir la cantidad en el inventario
            productoDb.cantidad -= cantidad;
            await productoDb.save();
        }

        respuesta.status = 'success';
        respuesta.msg = 'Compra realizada exitosamente';
        respuesta.data = ordenGuardada;

        emailDetalleVenta(ordenGuardada);
        
        res.json(respuesta);
    } catch (error) {
        console.error(error);
        respuesta.status = 'error';
        respuesta.msg = 'Error al realizar la compra';
        respuesta.data = error.message; // Añade el mensaje de error
        res.status(500).json(respuesta);
    }
};

// Función para eliminar el carrito
export const eliminarCarrito = async (req, res) => {
    const { _id: usuarioId } = req.usuario; // Suponiendo que tienes el usuario autenticado en req.usuario
    let respuesta = new Respuesta();

    try {
        // Elimina el carrito del usuario en la base de datos
        const carritoEliminado = await Carrito.findOneAndDelete({ usuario: usuarioId });

        if (!carritoEliminado) {
            respuesta.status = 'error';
            respuesta.msg = 'No se encontró un carrito para el usuario';
            return res.status(404).json(respuesta);
        }

        // Respuesta exitosa si el carrito se eliminó
        respuesta.status = 'success';
        respuesta.msg = 'El carrito ha sido eliminado correctamente';
        respuesta.data = carritoEliminado; // En caso de necesitar detalles del carrito eliminado
        res.json(respuesta);
    } catch (error) {
        console.error(error);
        respuesta.status = 'error';
        respuesta.msg = 'Hubo un error al intentar eliminar el carrito';
        res.status(500).json(respuesta);
    }
};