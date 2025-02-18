import jwt from "jsonwebtoken"
import Cliente from "../models/Cliente.js"

const checkAuth = async (req, res, next) => {
    try {
        //console.log(req.headers);
        
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Extraer el token después de "Bearer"
    
        if (!token) return res.status(401).json({ mensaje: 'Acceso denegado, falta token' });
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const cliente = await Cliente
            .findById({ _id: decoded.id })
            .select("-pass -confirmado -token -createdAt -updatedAt -__v");

        if (!cliente) {
            return res.json({ msg: "No se ha autenticado" });
        }else {
            req.usuario = cliente;
            //console.log(cliente);
            return next(); // avanza al sig middleware
        }
    } catch (error) {
        console.log(error);
        
        res.json({ msg: "Error en el servidor" });
    }
}

export default checkAuth;