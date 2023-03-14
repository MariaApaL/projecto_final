"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const Server_1 = require("./class/Server");
const user_route_1 = __importDefault(require("./routes/user-route"));
const server = new Server_1.Server();
server.app.use(body_parser_1.default.urlencoded({ limit: '5mb', extended: true }));
server.app.use(body_parser_1.default.json({ limit: '5mb' }));
server.app.use((0, cors_1.default)({
    credentials: true,
    origin: true
}));
server.app.use('/user', user_route_1.default);
server.start(() => {
    console.log('server iniciado en el puerto ' + server.port);
});
// Conexion a MongoDb con mi usuario y contraseña
mongoose_1.default.connect('mongodb+srv://root:root@project.s4gvf6v.mongodb.net/?retryWrites=true&w=majority', 
// mongodb+srv://root:B8Z2TEvqtoFACg4P@approutes.yj6s2i4.mongodb.net/?retryWrites=true&w=majority
// {   useNewUrlParser:true,
//     useUnifiedTopology:true,
//     useCreateIndex: true}
(err) => {
    if (err) {
        console.log("error", err);
        throw err;
    }
    else {
        console.log("Conectado a la bbdd con exito");
    }
});
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
