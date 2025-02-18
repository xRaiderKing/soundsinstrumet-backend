import express from "express";
import upload from "../middleware/subirImagen.js";
import checkAuth from "../middleware/chekAuth.js";
import checkRol from "../middleware/checkRol.js";

import { 
    aggProducto, 
    listarProductos, 
    obtenerProducto, 
    editarProducto, 
    eliminarProducto, 
    subirImagen,
    obtenerProductosNvs,
    obtenerProductosFiltrados,
    obtenerUrlImagen
} from "../controllers/productoController.js";

const router = express.Router();

// http://localhost:PUERTO/productos/rutas-de-abajo

// Ruta para agregar un nuevo producto
router.post('/add', checkAuth, checkRol, upload.single('imagen'), aggProducto);

// Ruta para agregar una imagen a un producto existente
router.post('/add-img/:id', checkAuth, checkRol , upload.single('imagen'), subirImagen);

// Ruta para listar todos los productos con paginación
router.get('/listar', listarProductos);

// Ruta para listar los primeros 10 productos
router.get('/nuevos',obtenerProductosNvs);

// Ruta para obtener un producto por su ID
router.get('/:id', obtenerProducto);

// Ruta para editar un producto por su ID
router.put('/edit/:id', checkAuth, checkRol, editarProducto);

// Ruta para eliminar un producto por su ID
router.delete('/delete/:id', checkAuth, checkRol, eliminarProducto);

// Ruta para filtrar productos
router.get('/',obtenerProductosFiltrados);

router.get('/img', obtenerUrlImagen);

export default router;
