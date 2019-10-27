import {Router} from 'express';
import User from './app/models/User';

const routes = new Router();

routes.get('/',async(req,res) =>{
    const user = await User.create({
        name : 'Federico N',
        email : 'nfederico3@live.com',
        password_hash: 'f343434',
    });
    res.json(user);

});

module.exports = routes;