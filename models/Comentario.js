import mongoose from "mongoose";



const comentarioSchema = mongoose.Schema(
    {
        calificacion: { type:Number, requred:true, trim:true },
        comentario: { type:String, required:false, trim:true },
        usuario: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Cliente',  // Referencia al esquema Usuario
            required: true 
        },
        producto: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Producto',  // Referencia al esquema Producto
            required: true 
        }
    },
    { timestamps: true }  // Para agregar las fechas de creación y actualización automáticamente
);

// convertir el esquema a modelo para poderlo trabajar
const Comentario = mongoose.model("Comentario",comentarioSchema);

//hacerlo disponible en la aplicación
export default Comentario;