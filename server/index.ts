import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import { Server } from "./class/Server";
import userRoute from "./routes/user-route";

const server = new Server();


server.app.use(bodyParser.urlencoded({limit:'5mb', extended:true}));
server.app.use(bodyParser.json({limit:'5mb'}));
server.app.use(cors({
        credentials:true,
        origin:true
    }));

server.app.use('/user', userRoute)



server.start(()=>{
    console.log('server iniciado en el puerto '+ server.port);
})


// Conexion a MongoDb con mi usuario y contraseña
mongoose.connect('mongodb+srv://root:root@project.s4gvf6v.mongodb.net/?retryWrites=true&w=majority',
// mongodb+srv://root:B8Z2TEvqtoFACg4P@approutes.yj6s2i4.mongodb.net/?retryWrites=true&w=majority
// {   useNewUrlParser:true,
//     useUnifiedTopology:true,
//     useCreateIndex: true}
    (err)=>{
        if(err){
            console.log("error",err)
            throw err
        }else{
            console.log("Conectado a la bbdd con exito")
        }
    })


// import { Server } from "./class/server";
// import cors from "cors";
// import bodyparser from "body-parser"
// import userRoute from "./routes/user-route";
// import mongoose from "mongoose";



// let myServer = new Server();
 
// myServer.app.use(bodyparser.json({
//     limit:"5mb"
// }))

// myServer.app.use(bodyparser.urlencoded({
//     extended:true,
//     limit:"5mb"
// }))

// myServer.app.use(cors({
//     credentials:true,
//     origin:true
// })
// )

// myServer.app.use('/user', userRoute)

// myServer.start(()=>{ 
//     console.log("corriendo en el puerto rico "+ myServer.port );
// });

// // Conexion a MongoDb con mi usuario y contraseña
// mongoose.connect('mongodb+srv://root:root@cryptobros.kkdzk90.mongodb.net/?retryWrites=true&w=majority',
// // mongodb+srv://root:B8Z2TEvqtoFACg4P@approutes.yj6s2i4.mongodb.net/?retryWrites=true&w=majority
// // {   useNewUrlParser:true,
// //     useUnifiedTopology:true,
// //     useCreateIndex: true}
//     (err)=>{
//         if(err){
//             console.log("error",err)
//             throw err
//         }else{
//             console.log("Conectado a la bbdd con exito")
//         }
//     })


