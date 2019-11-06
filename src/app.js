import express from 'express';
import path from 'path';
import routes from './routes';

import './database';


class App {
    constructor(){
        this.server = express();
        this.middelwares();
        this.routes();
                  };



    middelwares(){
        this.server.use(express.json());
        this.server.use('/files',express.static(path.resolve(__dirname,'..','tmp','uploads'))); // para resolver el avatar
    };
    routes(){
        this.server.use(routes);
    } ;
}

module.exports = new App().server;