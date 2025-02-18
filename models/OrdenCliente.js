import mongoose from "mongoose";

// Definir el esquema para OrdenProductos
const ordenProductoSchema = new mongoose.Schema(
    {
        cliente: {
            clienteId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Cliente', // Se refiere a la colección de clientes
                required: true
            },
            nombre: { type: String, required: true },
            email: { type: String, required: true }

        },
        productos: [
            {
                productoId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Producto', // Se refiere a la colección de productos
                    required: true
                },
                cantidad: {
                    type: Number,
                    required: true
                },
                precio: {
                    type: Number,
                    required: true
                },
                nombre: {type:String},
                descripcion: {type:String},
                imagen: {type:String},
            }
        ],
        total: {
            type: Number,
            required: true,
            default: 0
        },
        estado: {
            type: String,
            enum: ['pendiente', 'procesando', 'completado', 'cancelado'], // Diferentes estados de la orden
            default: 'pendiente'
        },
        creadoEn: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true // Agrega campos de creado y actualizado automáticamente
    }
);

// Convertir el esquema a modelo para poderlo trabajar
const OrdenProducto = mongoose.model("OrdenProducto", ordenProductoSchema);

// Hacerlo disponible en la aplicación
export default OrdenProducto;
