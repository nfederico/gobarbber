import Sequelize, {Model} from 'sequelize';


class Appointment extends Model {
    static init (sequelize){
       super.init({
        date:Sequelize.DATE,
        cancelled_at:Sequelize.DATE,
      
       },
       {
           sequelize,
       }
       );
      
      
     return this;

    }
    static associate(models) {
        this.belongsTo(models.User,{foreignKey: 'user_id', as: 'user'}); // uso el as si o si cuando tengo dos relaciones con la misma tabla
        this.belongsTo(models.User,{foreignKey: 'provider_id', as: 'provider'});

    }

}

export default Appointment;