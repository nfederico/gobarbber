const {Router} = require ('express');

const routes = new Router();
routes.get('/',(req,res) =>{
    res.json({"msg":"Hola Mundo!"})

});

module.exports = routes;