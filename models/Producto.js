import mongoose from "mongoose";

const productoSchema = mongoose.Schema(
    {
        nombre: {type:String, required:true},
        descripcion: {type:String, required:false},
        precio:{type:Number, required:true}, 
        cantidad:{type:Number, required:true}, // Se agrega la cantidad de productos disponibles
        categoria: {
            type: String,
            enum: ['Percusión', 'Teclas', 'Viento', 'Membranófonos','Electrófonos'], // Diferentes estados de la orden
            required:true
        }, // Se agrega a que categoria pertenece
        estante: {type:String, required:false}, // Se agrega el estante donde se ubica
        seccionEstante: {type:String, required:false}, // Se agrega la seccion del estante a la que pertence
        imagen:{type:String, required:false}
    },
    {
        timestamps:true,
        required:false //genera columnas de creado y actualizado
    }
);

// convertir el esquema a modelo para poderlo trabajar
const Producto = mongoose.model("Producto",productoSchema);

//hacerlo disponible en la aplicación
export default Producto;