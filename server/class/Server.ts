import express from 'express';
import Application from 'express';

export class Server{
    public port:number = 3100;
    public app: express.Application;

    constructor(){
        this.app = express();
    }

    start(funcion:()=>void){
        this.app.listen(this.port,funcion);
        
    }
}