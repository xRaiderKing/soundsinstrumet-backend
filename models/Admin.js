import mongoose from "mongoose";
import bcrypt from "bcrypt";

//schema
const AdminSchema = mongoose.Schema(
    {
        nombre: { type: String, required: true, trim: true },
        apellido: { type: String, required: true, trim: true },
        pass: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true, unique: true, lowercase: true },
        phone: { type: String, trim: true },
        token: { type: String },
        confirmado: { type: Boolean, default: false },
        rol:{type:String, requided:true, default:'ADMTlN'}
    }, 
    {
        timestamps:true //genera columnas de creado y actualizado
    }
);


/**
 * .pre, es un middleware que se ejecuta antes de almacenar,
 *  
 */
AdminSchema.pre('save', async function(next) {
    // revisa que el password no haya sido cambiado por cambios en el perfil
    /* if(!this.isModified('pass')){
        next(); // pasa al siguiente middleware
    }; */
    const salt = await bcrypt.genSalt(10); // genara salto de 10 rondas
    // hash
    this.pass = await bcrypt.hash(this.pass,salt); // this.pass hace refencia al objeto que se almacenara
});

/**
 *  Esto añade un nuevo metodo al schema, que podra
 *  ser utilizado por la instancia 
 */
AdminSchema.methods.comprobarPass = async function(passForm){
    return await bcrypt.compareSync(passForm,this.pass);
};




// convertir el esquema a modelo para poderlo trabajar
const Admin = mongoose.model("Admin",AdminSchema);

//hacerlo disponible en la aplicación
export default Admin;