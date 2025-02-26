import  express, { json }  from "express";
import dotenv from 'dotenv';
import cors from "cors"; // permitir coneiones desde el domini del front
import csrf from "csurf";
import cookieParser from "cookie-parser";
import schedule from 'node-schedule';


import conectarDB from "./config/db.js";
import { Oferta } from "./models/Oferta.js";

import clienteRouter from "./routes/clienteRoutes.js";
import productoRouter from "./routes/productoRoutes.js";
import authRouter from "./routes/authRoutes.js";
import comentarioRouter from "./routes/comentarioRoutes.js";
import carritoRouter from "./routes/carritoRoutes.js";
import ordenRouter from "./routes/ordenRoutes.js";


// concentra la funcionalidad de express
const app = express();
app.use(express.json()); // para que procese informacion json correctamente

// Habilitar cookie
app.use(cookieParser());
app.use('/public/uploads', express.static('public/uploads')); // 'uploads' es la carpeta donde guardas las imágenes

// CSRF
//app.use( csrf({cookie:true}) );

// Esto va a buscar por un archivo .env
dotenv.config()

// conectar a la base de datos
conectarDB();

// Configurar CORS
// Dominios Permitidos
const corsOptions = {
    origin: ["https://soundsinstrument.web.app", "http://localhost:4200"], // Agrega los dominios permitidos
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true // Si usas cookies o sesiones
};

app.use(cors(corsOptions));

// Middleware extra para asegurarnos de que los headers se envían correctamente
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*"); // Para asegurarnos de permitir el origen correcto
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

// Routing
/* app.get('/api/usuarios',(req,res)=>{
    res.send('Hola mundo') //send permite mostrar info en la pantalla
    res.json({msg:'ok'}) //  respuesta tipo json para acceder a datos
    }) */
   app.use('/auth',authRouter); //aqui viene login y regisro y todo eso
   app.use('/productos',productoRouter);
   app.use('/coment',comentarioRouter);
   app.use('/carrito', carritoRouter);
   app.use('/orden', ordenRouter);
   app.use('/clientes',clienteRouter)
   
   // puerto
   const PORT = process.env.PORT || 4000; 
   
   
   
   //TODO: tarea programada para eliminar los descuentos a los aofrtunados
   schedule.scheduleJob('08 13 * * *', () => {
    /* const tarea = new TareaDiaria();
    tarea.ejecutar(); */
    const decsuentos =  new Oferta;
    console.log('Limpiando descuentos...');
    decsuentos.limpiarDescuento();
 });
   
   // Programa la tarea para ejecutarse a la medianoche
   schedule.scheduleJob('10 13 * * *', () => {
       /* const tarea = new TareaDiaria();
       tarea.ejecutar(); */
       const decsuentos =  new Oferta;
       console.log('Enviando descuentos...');
       decsuentos.obtenerDescuento();
    });

    
    
    app.listen(PORT,()=>{
        console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
