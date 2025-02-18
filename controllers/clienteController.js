import Cliente from "../models/Cliente.js";

class Respuesta {
    status = '';
    msg = '';
    data = null;
}

// Función para listar clientes
const listarClientes = async (req, res, next) => {
    let respuesta = new Respuesta();

    try {
        const clientes = await Cliente.find({});
        respuesta.status = 'success';
        respuesta.msg = 'Clientes listados correctamente';
        respuesta.data = clientes;
        res.json(respuesta);
    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'Error al listar clientes';
        res.status(500).json(respuesta);
        next();
    }
};

// Función para obtener un cliente por ID
const obtenerCliente = async (req, res, next) => {
    let respuesta = new Respuesta();

    try {
        const id = req.params.idC;
        const cliente = await Cliente.findById(id);

        if (!cliente) {
            respuesta.status = 'error';
            respuesta.msg = 'Cliente no encontrado';
            return res.status(404).json(respuesta);
        }

        respuesta.status = 'success';
        respuesta.msg = 'Cliente encontrado';
        respuesta.data = cliente;
        res.json(respuesta);
    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'Error al obtener el cliente';
        res.status(500).json(respuesta);
        next();
    }
};

// Función para editar un cliente
const editarCliente = async (req, res, next) => {
    let respuesta = new Respuesta();

    try {
        const {idC} = req.params;
        const cliente = await Cliente.findById(idC);
        //console.log(req.params)
        if (!cliente) {
            respuesta.status = 'error';
            respuesta.msg = 'Cliente no encontrado';
            return res.status(404).json(respuesta);
        }

        const clienteAct = await Cliente.findByIdAndUpdate(idC, req.body, { new: true });

        respuesta.status = 'success';
        respuesta.msg = 'Cliente actualizado correctamente';
        respuesta.data = null;
        res.json(respuesta);
    } catch (error) {
        //console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'No se pudo editar el cliente';
        res.status(500).json(respuesta);
    }
};

// Función para eliminar un cliente
const eliminarCliente = async (req, res, next) => {
    let respuesta = new Respuesta();

    try {
        const id = req.params.idC;
        const cliente = await Cliente.findById(id);

        if (!cliente) {
            respuesta.status = 'error';
            respuesta.msg = 'Cliente no encontrado';
            return res.status(404).json(respuesta);
        }

        const clienteDel = await Cliente.findByIdAndDelete(id);

        respuesta.status = 'success';
        respuesta.msg = 'Cliente eliminado correctamente';
        respuesta.data = clienteDel;
        res.json(respuesta);
    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'No se pudo eliminar el cliente';
        res.status(500).json(respuesta);
    }
};

export {
    listarClientes,
    obtenerCliente,
    editarCliente,
    eliminarCliente
};
