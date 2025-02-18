import mongoose from "mongoose";

// Definir el esquema para EspacioProducto
const espacioProductoSchema = mongoose.Schema(
    {
        productoId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Producto', // Se refiere al esquema de Producto
            required: true
        },
        estante: {
            type: String,
            required: true // Estante donde está el producto
        },
        seccionEstante: {
            type: String,
            required: true // Sección del estante
        },
        estatus: {
            type: Boolean,
            required: true, // Indica si el espacio está ocupado (true) o disponible (false)
            default: true // Por defecto se asume que el espacio está ocupado
        }
    },
    {
        timestamps: true // Agrega campos de creado y actualizado automáticamente
    }
);

// Convertir el esquema a modelo para poderlo trabajar
const EspacioProducto = mongoose.model("EspacioProducto", espacioProductoSchema);

// Hacerlo disponible en la aplicación
export default EspacioProducto;
