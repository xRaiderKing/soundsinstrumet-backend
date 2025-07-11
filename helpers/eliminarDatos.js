import Cliente from "../models/Cliente.js";

export class EliminarDatos {
    constructor () {
    }

    async idenClienteInact () {
        let fechaAct = new Date();

        let clientes = await Cliente.find();
        clientes.forEach(cliente => {
            const ultimaAct = new Date(cliente.updatedAt);

            if(ultimaAct == "Invalid Date"){
                console.warn('Fecha no valida para: ', cliente.nombre)
            }

            const diferenciaDias = (fechaAct - ultimaAct) / (1000 * 60 * 60 * 24);

            if(diferenciaDias >= 40){
                console.warn(`El usuario ${cliente.nombre} será eliminado por inactividad de ${Math.floor(diferenciaDias)} días`);
                // Cliente.deleteOne({ _id: cliente._id });
            }
        });
    }
   
}

