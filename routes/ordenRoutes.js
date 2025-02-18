import express from "express";
import checkAuth from "../middleware/chekAuth.js";
import checkRol from "../middleware/checkRol.js";
import { ordenCliente, ordenesClientes } from "../controllers/ordenProductoController.js"; // Importamos el controlador

const router = express.Router();

// Ruta para listar todos los productos comprados por un cliente
router.get('/historial-compras', checkAuth, ordenCliente);
router.post('/historial-ventas', checkAuth, checkRol, ordenesClientes);

export default router;
