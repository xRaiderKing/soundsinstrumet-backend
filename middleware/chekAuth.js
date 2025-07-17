import jwt from "jsonwebtoken"
import Cliente from "../models/Cliente.js"
import logger from "../helpers/logger.js";

const checkAuth = async (req, res, next) => {
    try {
        //console.log(req.headers);
        
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Extraer el token después de "Bearer"
    
        if (!token) { 
            logger.warn(`Acceso denegado: sin token - IP: ${req.ip}`);
            return res.status(401).json({ mensaje: 'Acceso denegado, falta token' });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const cliente = await Cliente
            .findById({ _id: decoded.id })
            .select("-pass -confirmado -token -createdAt -updatedAt -__v");

        if (!cliente) {
            logger.warn(`Token válido pero usuario no encontrado - ID: ${decoded.id}`);
            return res.json({ msg: "No se ha autenticado" });
        }else {
            logger.info(`Usuario autenticado: ${cliente.email} - IP: ${req.ip}`);
            req.usuario = cliente;
            //console.log(cliente);
            return next(); // avanza al sig middleware
        }
    } catch (error) {
        console.log(error);
        logger.error(`Fallo en checkAuth - IP: ${req.ip} - Error: ${error.message}`)
        res.json({ msg: "Error en el servidor" });
    }
}

export default checkAuth;