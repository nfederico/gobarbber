import User from '../models/User';
import File from '../models/File';


class ProviderController {
    async index (req,res)
{
    const providers = await User.findAll({where:{provider:true},
        attributes:['id','email','name','avatar_id'],
        include: {model:File, as:'avatar', attributes:['path','name','url'] } // le plancho la informacion del avatar
    });
    return res.json(providers);
}
}

export default new ProviderController();