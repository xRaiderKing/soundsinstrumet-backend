import { unlink } from "node:fs/promises";
import Producto from "../models/Producto.js";

class Respuesta {
    status = '';
    msg = '';
    data = null;
}

// Función para agregar nuevo producto
const aggProducto = async (req, res, next) => {
    let respuesta = new Respuesta();
    const producto = new Producto(req.body);
    console.log(req.file);
    try {
        producto.imagen = req.file.filename;
        await producto.save();
        respuesta.status = 'success';
        respuesta.msg = 'Se agregó un producto nuevo';
        respuesta.data = producto;
        res.json(respuesta);
    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'Error al agregar el producto';
        res.json(respuesta);
    }
};

// Función para listar productos con paginación
const listarProductos = async (req, res, next) => {
    let respuesta = new Respuesta();
    const { pagina: paginaActual = 1 } = req.query;

    try {
        const limit = 10;
        const offset = (paginaActual - 1) * limit;
        const productos = await Producto.find().limit(limit).skip(offset);
        const totalProductos = await Producto.countDocuments();

        const productosConImagen = productos.map(producto => ({
            ...producto._doc,
            imagenUrl: obtenerUrlImagen(req, producto.imagen)
        }));

        respuesta.status = 'success';
        respuesta.msg = 'Productos listados correctamente';
        respuesta.data = {
            productos: productosConImagen,
            paginaActual: Number(paginaActual),
            totalPaginas: Math.ceil(totalProductos / limit),
            totalProductos
        };
        res.json(respuesta);
    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'Error al listar productos';
        res.json(respuesta);
    }
};

// Función para obtener los primeros 10 productos
const obtenerProductosNvs = async (req, res) => {
    let respuesta = new Respuesta();
    try {
        // Ordena por fecha de creación en orden descendente y limita a los últimos 10
        const productos = await Producto.find().sort({ createdAt: -1 }).limit(10);
        respuesta.status = 'success';
        respuesta.msg = 'Últimos productos obtenidos correctamente';
        
        let nvProds = [];
        productos.map(prod => {
            prod.imagen = obtenerUrlImagen(req, prod.imagen);
            nvProds.push(prod);
        })

        respuesta.data = nvProds;
        
        res.json(respuesta);
    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'Error al obtener los productos';
        respuesta.data = [];
        res.json(respuesta);
    }
};

// Función para listar un solo producto
const obtenerProducto = async (req, res, next) => {
    let respuesta = new Respuesta();
    const { id } = req.params;

    try {
        const producto = await Producto.findById(id);
        if (!producto) {
            respuesta.status = 'error';
            respuesta.msg = 'Producto no encontrado';
            return res.json(respuesta);
        }

        const imagenUrl = obtenerUrlImagen(req, producto.imagen);
        respuesta.status = 'success';
        respuesta.msg = 'Producto obtenido correctamente';
        respuesta.data = { producto, imagenUrl };
        res.json(respuesta);
    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'Error al obtener el producto';
        respuesta.data = {};
        res.json(respuesta);
    }
};

// Función para editar producto
const editarProducto = async (req, res, next) => {
    let respuesta = new Respuesta();
    console.log(req.params)
    const { id } = req.params;

    try {
        const producto = await Producto.findById(id);
        if (!producto) {
            respuesta.status = 'error';
            respuesta.msg = 'Producto no encontrado';
            return res.json(respuesta);
        }

        producto.nombre = req.body.nombre || producto.nombre;
        producto.descripcion = req.body.descripcion || producto.descripcion;
        producto.precio = req.body.precio || producto.precio;
        producto.cantidad = req.body.cantidad || producto.cantidad;
        producto.categoria = req.body.categoria || producto.categoria;
        producto.estante = req.body.estante || producto.estante;
        producto.seccionEstante = req.body.seccionEstante || producto.seccionEstante;
        producto.imagen = req.body.imagen || producto.imagen;


        const productoActualizado = await producto.save();
        respuesta.status = 'success';
        respuesta.msg = 'Producto actualizado correctamente';
        respuesta.data = productoActualizado;
        res.json(respuesta);
    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'Error al actualizar producto';
        res.json(respuesta);
    }
};

// Función para eliminar un producto
const eliminarProducto = async (req, res, next) => {
    let respuesta = new Respuesta();
    const { id } = req.params;

    try {
        const producto = await Producto.findById(id);
        if (!producto) {
            respuesta.status = 'error';
            respuesta.msg = 'Producto no encontrado';
            return res.json(respuesta);
        }

        await unlink(`public/uploads/${producto.imagen}`);
        await producto.deleteOne();

        respuesta.status = 'success';
        respuesta.msg = 'Producto eliminado correctamente';
        res.json(respuesta);
    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'Error al eliminar producto';
        res.json(respuesta);
    }
};

// Función para subir imagen
const subirImagen = async (req, res, next) => {
    let respuesta = new Respuesta();
    const { id } = req.params;

    try {
        const extProducto = await Producto.findById(id);
        if (!extProducto) {
            respuesta.status = 'error';
            respuesta.msg = 'Producto no encontrado';
            return res.json(respuesta);
        }

        extProducto.imagen = req.file.filename;
        await extProducto.save();

        respuesta.status = 'success';
        respuesta.msg = 'Imagen subida correctamente';
        respuesta.data = extProducto;
        res.json(respuesta);
    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'Error al subir imagen';
        res.json(respuesta);
    }
};

const obtenerUrlImagen = (req, imagenNombre) => {
    if (!imagenNombre) return null;
    return `${req.protocol}://${req.get('host')}/public/uploads/${imagenNombre}`;
};

const obtenerProductosFiltrados = async (req, res) => {
    let respuesta = new Respuesta();

    ///productos?categoria
    try {
        // Desestructuramos los filtros desde el query de la URL
        const { categoria, minPrecio, maxPrecio, nombre } = req.query;
        // Construimos un objeto de filtros dinámico
        let filtros = {};

        // Agregamos la categoría si está presente
        if (categoria) {
            filtros.categoria = categoria;
        }

        // Agregamos el filtro de rango de precios si ambos límites están presentes
        if (minPrecio && maxPrecio) {
            filtros.precio = { $gte: parseFloat(minPrecio), $lte: parseFloat(maxPrecio) };
        } else if (minPrecio) {
            filtros.precio = { $gte: parseFloat(minPrecio) };
        } else if (maxPrecio) {
            filtros.precio = { $lte: parseFloat(maxPrecio) };
        }

        // Agregamos el filtro de nombre usando expresión regular para búsqueda parcial
        if (nombre) {
            filtros.nombre = { $regex: nombre, $options: 'i' }; // 'i' para que sea insensible a mayúsculas
        }
        console.log(filtros);

        // Si no se aplica ningún filtro, devolvemos todos los productos
        const productos = Object.keys(filtros).length === 0
            ? await Producto.find()
            : await Producto.find(filtros);
        
        let nvProds = [];
        
        productos.map(prod => {
            prod.imagen = obtenerUrlImagen(req, prod.imagen);
            nvProds.push(prod);
        })
        respuesta.status = 'success';
        respuesta.msg = 'Productos filtrados';
        respuesta.data = nvProds;

        res.json(respuesta);
    } catch (error) {
        respuesta.status = 'success';
        respuesta.msg = 'Hubo un error al obtener los productos';
        respuesta.data = [];

        res.json(respuesta);
    }
}

export {
    aggProducto,
    subirImagen,
    listarProductos,
    editarProducto,
    eliminarProducto,
    obtenerProducto,
    obtenerProductosNvs,
    obtenerProductosFiltrados,
    obtenerUrlImagen
};
