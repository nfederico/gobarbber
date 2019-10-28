import * as Yup from 'yup'; //el * es porque la libreria yup no tiene ningun export default, es un cacho de codigo

import jwt from 'jsonwebtoken';
import User from '../models/User';
import AuthConfig from '../../config/auth';


class SessionController {
    
async store(req,res){
    const schema = Yup.object().shape({
        email: Yup.string().email().required(),
        password: Yup.string().required(),
    }); 
    const {email,password} = req.body;
    const user = await User.findOne({where:{email}});
    if (!user){
       return res.status(401).json({error:'User invalid!'});
       }
    if (!( await user.checkPassword(password))) {
        return res.status(401).json({error:'Bad Password'});
    }
    const {id,name} =user;
    return res.json({
        user: {
            id,
            name,
            email
        },
        token: jwt.sign({id},AuthConfig.secret,{
            expiresIn:AuthConfig.expiresIn,
        })
    })
}


}


export default new SessionController();