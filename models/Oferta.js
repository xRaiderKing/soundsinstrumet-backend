import Cliente from "./Cliente.js";

export class Oferta {
    // 25 / 35 / 30 / 40 / 20 / 15 / 10  
    clientesSeleccionados = [];
    rank1 = 0; // inicio
    rank2 = 0 // fin
    //dia = new Date('2024-11-30').getDay();
    dia = new Date().getDay();

    constructor() { }

    async obtenerDescuento() {
        // traer clientes
        const clientes = await Cliente.find();
        console.log(clientes);

        // seleccionar clientes
        this.rank1 = Math.floor(Math.random() * (clientes.length / 2) + 1);
        this.rank2 = this.generarNumeroAleatorio(this.rank1, clientes.length);
        if (this.rank2 === this.rank1) this.rank2 = this.generarNumeroAleatorio(this.rank1, clientes.length);
        this.clientesSeleccionados = clientes.slice(this.rank1, this.rank2);
        console.log({ n1: this.rank1, n2: this.rank2 });
        console.log(this.clientesSeleccionados);

        switch (this.dia) {
            case 1:
                // agregar objeto descuento;
                this.clientesSeleccionados.forEach((cliente) => {
                    cliente.descuento.descuento = .25;
                    cliente.notificarDescuento();
                    cliente.save();
                    console.log(cliente);
                })

                // notificar
                console.log('notificación');
                break;
            case 2:
                // agregar objeto descuento;
                this.clientesSeleccionados.forEach((cliente) => {
                    cliente.descuento.descuento = .35;
                    cliente.notificarDescuento();
                    cliente.save();
                    console.log(cliente);
                })

                // notificar
                console.log('notificación');
                break;
            case 3:
                // agregar objeto descuento;
                this.clientesSeleccionados.forEach((cliente) => {
                    cliente.descuento.descuento = .30;
                    cliente.notificarDescuento();
                    cliente.save();
                    console.log(cliente);
                })

                // notificar
                console.log('notificación');
                break;
            case 4:
                // agregar objeto descuento;
                this.clientesSeleccionados.forEach((cliente) => {
                    cliente.descuento.descuento = .40;
                    cliente.notificarDescuento();
                    cliente.save();
                    console.log(cliente);
                })

                // notificar
                console.log('notificación');
                break;
            case 5:
                // agregar objeto descuento;
                this.clientesSeleccionados.forEach((cliente) => {
                    cliente.descuento.descuento = .20;
                    cliente.notificarDescuento();
                    cliente.save();
                    console.log(cliente);
                })

                // notificar
                console.log('notificación');
                break;
            case 6:
                // agregar objeto descuento;
                this.clientesSeleccionados.forEach((cliente) => {
                    cliente.descuento.descuento = .15;
                    cliente.notificarDescuento();
                    cliente.save();
                    console.log(cliente);
                })

                // notificar
                console.log('notificación');
                break;

            case 0:
                // agregar objeto descuento;
                this.clientesSeleccionados.forEach((cliente) => {
                    cliente.descuento.descuento = .10;
                    cliente.notificarDescuento();
                    cliente.save();
                    console.log(cliente);
                })

                // notificar
                console.log('notificación');
                break;
        }
    }

    generarNumeroAleatorio(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    async limpiarDescuento(){
        const clientes = await Cliente.find();
        console.log(clientes);
        
        clientes.forEach((cliente) => {
            cliente.descuento.descuento = .30;
            cliente.eliminarDescuento();
        })
        
    }
}
