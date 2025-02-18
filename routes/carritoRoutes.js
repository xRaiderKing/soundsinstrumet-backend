import express from 'express';
import { agregarAlCarrito, eliminarDelCarrito, incrementarCantidad, decrementarCantidad, obtenerCarrito, realizarCompra, eliminarCarrito } from '../controllers/carritoController.js';
import checkAuth from '../middleware/chekAuth.js';

const router = express.Router();

// Ruta para obtener el carrito de un usuario
router.get('/', checkAuth, obtenerCarrito);

// Ruta para agregar un producto al carrito
router.post('/agregar', checkAuth, agregarAlCarrito);

// Ruta para eliminar un producto del carrito
router.delete('/eliminar', checkAuth, eliminarDelCarrito);

// Ruta para incrementar la cantidad de un producto en el carrito
router.put('/incrementar', checkAuth, incrementarCantidad);

// Ruta para decrementar la cantidad de un producto en el carrito
router.put('/decrementar', checkAuth, decrementarCantidad);

// Ruta para realizar compra
router.post('/compras',checkAuth, realizarCompra);

router.delete('/eliminar-all', checkAuth, eliminarCarrito);

export default router;
