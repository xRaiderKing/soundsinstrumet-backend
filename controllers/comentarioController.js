import Producto from "../models/Producto.js";
import Comentario from "../models/Comentario.js";
import { check, validationResult } from "express-validator";

class Respuesta {
    status = '';
    msg = '';
    data = null;
}

// Función para agregar nuevo comentario
const aggComentarios = async (req, res, next) => {
    let respuesta = new Respuesta();
    const { prod } = req.params;
    const { _id } = req.usuario;
    const { calificacion, comentario } = req.body;

    try {
        const productoExiste = await Producto.findById(prod);
        if (!productoExiste) {
            respuesta.status = 'error';
            respuesta.msg = 'Producto no encontrado';
            return res.json(respuesta);
        }

        await check('calificacion').isInt({ min: 0, max: 5 }).withMessage('Máximo 5 estrellas, mínimo 0').run(req);
        await check('comentario').notEmpty().withMessage('El comentario no puede ir vacío').run(req);

        let resultado = validationResult(req);
        if (!resultado.isEmpty()) {
            respuesta.status = 'error';
            respuesta.msg = 'Se encontraron mensajes de error';
            respuesta.data = resultado.array();
            return res.json(respuesta);
        }

        let nwComentario = new Comentario({ calificacion, comentario, usuario: _id, producto: productoExiste._id });
        await nwComentario.save();

        respuesta.status = 'success';
        respuesta.msg = 'Comentario agregado correctamente';
        respuesta.data = nwComentario;
        res.json(respuesta);
    } catch (error) {
        respuesta.status = 'error';
        respuesta.msg = 'No se encontró el producto';
        res.json(respuesta);
    }
};

// Función para listar comentarios por usuario
const listarComentariosPorUsuario = async (req, res, next) => {
    let respuesta = new Respuesta();
    const { _id } = req.usuario;

    try {
        const comentarios = await Comentario.find({ usuario: _id }).populate('producto', 'nombre');
        respuesta.status = 'success';
        respuesta.msg = 'Comentarios listados correctamente';
        respuesta.data = comentarios;
        res.json(respuesta);
    } catch (error) {
        respuesta.status = 'error';
        respuesta.msg = 'Error al listar comentarios por usuario';
        res.json(respuesta);
    }
};

// Función para listar comentarios por producto
const listarComentariosPorProducto = async (req, res, next) => {
    let respuesta = new Respuesta();
    const { prod } = req.params;

    try {
        const comentarios = await Comentario.find({ producto: prod }).populate('usuario', 'nombre');
        respuesta.status = 'success';
        respuesta.msg = 'Comentarios del producto listados correctamente';
        respuesta.data = comentarios;
        res.json(respuesta);
    } catch (error) {
        respuesta.status = 'error';
        respuesta.msg = 'Error al listar comentarios por producto';
        res.json(respuesta);
    }
};

// Función para editar un comentario
const editarComentario = async (req, res, next) => {
    let respuesta = new Respuesta();
    const { id } = req.params;
    const { _id } = req.usuario;
    const { calificacion, comentario } = req.body;

    try {
        const comentarioExistente = await Comentario.findById(id);
        if (!comentarioExistente) {
            respuesta.status = 'error';
            respuesta.msg = 'Comentario no encontrado';
            return res.json(respuesta);
        }

        if (comentarioExistente.usuario.toString() !== _id.toString()) {
            respuesta.status = 'error';
            respuesta.msg = 'No tienes permiso para editar este comentario';
            return res.json(respuesta);
        }

        comentarioExistente.calificacion = calificacion || comentarioExistente.calificacion;
        comentarioExistente.comentario = comentario || comentarioExistente.comentario;

        const comentarioActualizado = await comentarioExistente.save();
        respuesta.status = 'success';
        respuesta.msg = 'Comentario actualizado correctamente';
        respuesta.data = comentarioActualizado;
        res.json(respuesta);
    } catch (error) {
        respuesta.status = 'error';
        respuesta.msg = 'Error al actualizar comentario';
        res.json(respuesta);
    }
};

// Función para eliminar un comentario
const eliminarComentario = async (req, res, next) => {
    let respuesta = new Respuesta();
    const { id } = req.params;
    const { _id } = req.usuario;

    try {
        const comentario = await Comentario.findById(id);
        if (!comentario) {
            respuesta.status = 'error';
            respuesta.msg = 'Comentario no encontrado';
            return res.json(respuesta);
        }

        if (comentario.usuario.toString() !== _id.toString()) {
            respuesta.status = 'error';
            respuesta.msg = 'No tienes permiso para eliminar este comentario';
            return res.json(respuesta);
        }

        await comentario.deleteOne();
        respuesta.status = 'success';
        respuesta.msg = 'Comentario eliminado correctamente';
        res.json(respuesta);
    } catch (error) {
        respuesta.status = 'error';
        respuesta.msg = 'Error al eliminar comentario';
        res.json(respuesta);
    }
};

export {
    aggComentarios,
    listarComentariosPorUsuario,
    listarComentariosPorProducto,
    editarComentario,
    eliminarComentario
};
