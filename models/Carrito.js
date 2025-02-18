import mongoose from "mongoose";

const carritoSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cliente',
        required: true
    },
    productos: [
        {
            producto: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Producto',
                required: true
            },
            cantidad: {
                type: Number,
                required: true,
                default: 1
            },
            precio: {
                type: Number,
                required: false
            }
        }
    ],
    total: {
        type: Number,
        required: true,
        default: 0
    },
    creadoEn: {
        type: Date,
        default: Date.now
    }
});


// convertir el esquema a modelo para poderlo trabajar
const Carrito = mongoose.model("Carrito",carritoSchema);

//hacerlo disponible en la aplicación
export default Carrito;