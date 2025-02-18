const generarId = () => {
    const random = Math.random().toString(32).substring(2);
    const fecha = Date.now().toString(32);
    return random + fecha;
};


function users() {
    let i = 0;
    let prod =
    {
        nombre: `Product ${i}`,
        descrip: `Descripcion del producto ${i}`,
        precio: Number(`1${i}${i + 1}0`),
    };
    let prodts = [];

    for(i;i<15;i++) {
        prod =
        {
            nombre: `Product ${i}`,
            descrip: `Descripcion del producto ${i}`,
            precio: Number(`1${i}${i + 1}0`),
        };
        prodts.push(prod);
    }

    return prodts;
}

export default generarId;