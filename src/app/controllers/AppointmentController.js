import Appointment from '../models/Appointment';
import Notification from '../Schemas/Notifications';

import File from '../models/File';
import User from '../models/User';
import {startOfHour,parseISO,isBefore,format} from 'date-fns';
import * as Yup from 'yup';
import User from '../models/User';


class AppointmentController {
    async index(req,res){
        const {page = 1 } = req.query; // por default es la 1 si no viene en el req.query
        const appointments = await Appointment.findAll({
            where: {user_id: req.userId, cancelled_at: null },
            order: ['date'],
            attributes:['id','date'],
            limit:20,
            offset:(page - 1 )*20,
            include:[
                {
                    model: User,
                    as: 'provider',
                    attributes: ['id','name'],
                    include: [
                        {
                            model: File,
                            as: 'avatar',
                            attributes: ['id','path','url'],
                        },
                    ],
                },
            ],
        });
            return res.json(appointments);
    }
    async store(req,res){
        const schema = Yup.object().shape({
            provider_id:Yup.number().required(),
            date: Yup.date().required(),
        });
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({erro:'validation fails'});
            
        }
      const {provider_id,date} =req.body;
      /**
       * Check if provider_id is a provider
       * 
       */
        const isProvider = await User.findOne({where: {id:provider_id,provider:true}});
        if(!isProvider){
         return res.status(401).json({error:'you can only create appointments with providers' });
        }

      /**
       * Check if the appointment date is in the future 
       * 
       */
        const hourStart= startOfHour(parseISO(date));
        if (isBefore(hourStart,new Date())) {
          return res.status(400).json({error:'Past dates are note allowed!'})  ;
        }
        /**
       * Check date availability 
       * 
       */
        const  checkAppointmentAvailability = await Appointment.findOne({where:{
            provider_id,
            cancelled_at: null,
            date: hourStart,
        }});

        if (checkAppointmentAvailability) {
            return res.status(400).json({error:'Appointment date is not available'})  ;
        }

        const appointment = await Appointment.create({
            user_id:req.userId,
            provider_id,
            date: hourStart,
           
        });

/**
 * Notify service provider about the new schedule
 * 
 */
const user = await User.findByPk(req.userId);
const formatedDate = format(hourStart,
    " 'day' dd 'of' MMMM', at' H:MM'h' ");
        await Notification.create({
            content:`New schedule from ${user.name}  to ${formatedDate}  `,
            user:provider_id,
        });

       return res.json(appointment);
    }
    
    
    }
    
    
    export default new AppointmentController();