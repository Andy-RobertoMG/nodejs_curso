import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config({path:'.env'});
const generarId = () => Date.now().toString()+ Math.random().toString(32);
const emailRegistro = async (datos)=>{
  const transport = nodemailer.createTransport({
    host:"sandbox.smtp.mailtrap.io",
    port: 25,
    secure:false,
    tls:{ciphers:'SSLv3'},
    auth:{
      user: "7372284ccff42b",
      pass: "af4cce28cab13f"
    }
    
  })//Tuve que agregar secure:false y tls: ciphers para que funcionara
  const {email,nombre,token} = datos;
  const resultado = await transport.sendMail({
    from:"Bienesraices.com",
    to:email,
    subject:'Confirma tu cuenta en bienesraices.com',
    text:'Confirma tu cuenta en bienes raices',
    html:`
          <p>Hola ${nombre}, comprueba tu cuenta en bienesRaices.com</p>
          <p> Tu cuenta ya esta lista, solo debes confirmarla en el siguiente enlace:
          <a href="">Confirmar Cuenta </p>
          <p> Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
    `
  })
  // console.log(resultado);
}
export {generarId,emailRegistro};