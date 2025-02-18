import express from "express";
import {
    aggComentarios,
    listarComentariosPorUsuario,
    listarComentariosPorProducto,
    editarComentario,
    eliminarComentario
} from "../controllers/comentarioController.js";

import checkAuth from "../middleware/chekAuth.js"; // Middleware para verificar autenticación

const router = express.Router();


// http://localhost:PUERTO/coment/rutas-de-abajo

// Ruta para agregar nuevo comentario
router.post("/add/:prod", checkAuth, aggComentarios);

// Ruta para listar comentarios por usuario
router.get("/usuario", checkAuth, listarComentariosPorUsuario);

// Ruta para listar comentarios por producto
router.get("/producto/:prod", listarComentariosPorProducto);

// Ruta para editar comentario (solo el propietario del comentario puede editar)
router.put("/editar/:id", checkAuth, editarComentario);

// Ruta para eliminar comentario (solo el propietario del comentario puede eliminar)
router.delete("/eliminar/:id", checkAuth, eliminarComentario);

export default router;
