const express = require ('express');
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
    };
    routes(){
        this.server.use(routes);
    } ;
}

module.exports = new App().server;