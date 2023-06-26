import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config({path:'.env'});
const generarId = () => Date.now().toString()+ Math.random().toString(32);
const emailRegistro = async (datos)=>{
  const transport = nodemailer.createTransport({
    host:process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure:false,
    tls:{ciphers:'SSLv3'},
    auth:{
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
    
  })//Tuve que agregar secure:false y tls: ciphers para que funcionaras
  const {email,nombre,token} = datos;
  const resultado = await transport.sendMail({
    from:"Bienesraices.com",
    to:email,
    subject:'Confirma tu cuenta en bienesraices.com',
    text:'Confirma tu cuenta en bienes raices',
    html:`
          <p>Hola ${nombre}, comprueba tu cuenta en bienesRaices.com</p>
          <p> Tu cuenta ya esta lista, solo debes confirmarla en el siguiente enlace:
          <a href="${process.env.BACKEND_URL}:${process.env.PORT||3000}/auth/confirmar/${token}">Confirmar Cuenta </p>
          <p> Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
    `
  })
  // console.log(resultado);
}
export {generarId,emailRegistro};