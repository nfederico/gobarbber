import {Router} from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';

import AuthMiddleware from './app/middleware/auth';

const routes = new Router();
const upload =multer(multerConfig);

routes.post('/users',UserController.store);
routes.post('/sessions',SessionController.store);

routes.use(AuthMiddleware);  //todo lo que viene abajo usa ese Middleware osea seria global
routes.put('/users',UserController.update);
// routes.put('/users',AuthMiddleware,UserController.update);

routes.get('/providers',ProviderController.index);
routes.get('/appointments',AppointmentController.index);
routes.post('/appointments',AppointmentController.store);
routes.post('/files',upload.single('file'),FileController.store);
routes.get('/schedules',ScheduleController.index);

export default routes;