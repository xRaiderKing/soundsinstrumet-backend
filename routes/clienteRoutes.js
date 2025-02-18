import express from "express";

import { 
    editarCliente, 
    eliminarCliente, 
    listarClientes, 
    obtenerCliente, 
} from "../controllers/clienteController.js";

const router = express.Router();

// http://localhost:PUERTO/??????/rutas-de-abajo

router.get('/', listarClientes);
router.get('/:idC', obtenerCliente);

router.put('/:idC', editarCliente);

router.delete('/:idC', eliminarCliente)

export default router;