import Sequelize from 'sequelize';
const db = new Sequelize('','root','',{
  host: 'localhost',
  dialect:'mysql',
  port:3306,
  define:{
    timestamps:true
  }//Es para agregar columnas de cuando se agrego el usuario y cuando fue actualizado
  ,pool:{
    max:5,
    min:0,
    idle:1000,//Si no se esta ejecutando espera el tiempo indicado para que se finalize
    acquire:30000//El tiempo que va a esperar antes de dar un error
  } //Mantener o reutilizar mas conexiones que esten vivas si hay una viva que se utilize para que no se cree una nueva
,operatorAlianses:false
})
export default db; 