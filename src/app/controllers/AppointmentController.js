import Appointment from '../models/Appointment';
import {startOfHour,parseISO,isBefore} from 'date-fns';
import * as Yup from 'yup';
import User from '../models/User';


class AppointmentController {
    
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
       return res.json(appointment);
    }
    
    
    }
    
    
    export default new AppointmentController();