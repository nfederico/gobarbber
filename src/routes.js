import {Router} from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import AuthMiddleware from './app/middleware/auth';

const routes = new Router();

routes.post('/users',UserController.store);
routes.post('/sessions',SessionController.store);

routes.use('/users',AuthMiddleware);  //todo lo que viene abajo usa ese Middleware osea seria global
routes.put('/users',UserController.update);
// routes.put('/users',AuthMiddleware,UserController.update);

export default routes;