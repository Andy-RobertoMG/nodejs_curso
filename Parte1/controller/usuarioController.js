import Usuarios from "../models/Usuarios.js";
import pkg from "express-validator";
import { emailRecuperar, generarId } from "../helpers/tokens.js";
import { emailRegistro } from "../helpers/tokens.js"; 
import { where } from "sequelize";
import bcrypt from 'bcrypt'
// import Usuario from './../models/Usuarios';
const {check,validationResult} = pkg;
const formularioLogin = (req,res)=>{
  try{
  res.render('auth/login',{
    authenticate:false,
    pagina:"Iniciar Sesión"
  })
  }catch(e){
    console.log(e);
  }
  
  // res.send("hola")
};
/*
Funcion cuando se registra por primera vez
*/
const formularioRegistro = async(req,res)=>{
  Promise.allSettled(
    [fetch('https://randomuser.me/api/').then(response=>response.json())
    ]).then(
      (values=>{
        
        const [{value:usuario}]=values;
        const [{email,login:{username,password}}] = usuario.results;
        // console.log(usuario.results);
        res.render('auth/registro',{
            pagina:'Crear Cuenta',
            nombre:username||"Andy Roberto Mesta Gonzalez",
            password:password||"1231231",
            email,
            csrfToken: req.csrfToken()//Esta hecho para comprobar que la persona que se registrando lo esta haciendo desde la pagina
          })
  }))
  
};
const loginpasswordrecovery = (req,res)=>{
  res.render('auth/recovery',{
    pagina:'Recuperar Contraseña',
    csrfToken: req.csrfToken(),
  })
}
/**
 * Funcion de post cuando el usuario se esta registrando, si se registra correctamente lo manda a una pagina de que se ha creado,
 * si tiene algun error lo manda a la pagina inicial de registro con los datos para escribirlos correctamente
 * si ya existe manda un mensaje que el usuario ya existe
 */
const registrando = async(req,res)=>{
  await Promise.allSettled([check('nombre').notEmpty().withMessage("Esta vacio").run(req),check('email').notEmpty().isEmail().withMessage("Esta mal escrito el correo").run(req)
  ,check('password').notEmpty().isLength(6).withMessage("No cumple el minimo numero de valores").run(req)
  ,check('repetir').equals(req.body.password).withMessage("Las contraseñas deben ser iguales").run(req)
])
    const {nombre,email,password} = req.body;
    let resultado = validationResult(req);
      if(!resultado.isEmpty()){
        console.log("hola");
        res.render('auth/registro',
        {
          pagina:'Crear Cuenta',
          errores:resultado.array(),
          nombre,
          email,
          csrfToken: req.csrfToken(),//Esta hecho para comprobar que la persona que se registrando lo esta haciendo desde la pagina
          password,
        })
        return
      }
      const existeUsuario = await Usuarios.findOne({where:{email:req.body.email}});
      if(existeUsuario){
        res.render('auth/registro',{
          pagina:'Crear Cuenta',
          csrfToken: req.csrfToken(),//Esta hecho para comprobar que la persona que se registrando lo esta haciendo desde la pagina
          errores:[{msg:'Ya existe un usuario con el correo ingresado'}]
        })
        return
      }
        // console.log(resultado);
        const usuario= await Usuarios.create({...req.body,token:generarId()});
        res.render('templates/mensaje',{
          pagina:'Se ha creado la cuenta',
          mensaje:'Hemos Enviado un correo de confirmacion, presiona en el enlace'
        })
        emailRegistro({
          nombre:usuario.nombre,
          email:usuario.email,
          token:usuario.token
        })
      

  // console.log(resultado);
  // console.log(mensaje);
}
const resetPassword = async (req,res)=>{
  await check('email').isEmail().withMessage('Eso no parece un email').run(req);
  console.log("no funciona")
  let resultado = validationResult(req);
  console.log(resultado)
  //Verificar que el resultado este vacio
  if(!resultado.isEmpty()){
    return res.render('auth/recovery',{
      pagina:'Recupera tu acceso a Bienes Raices',
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
    }
    )
  }
  const {email} = req.body;
  const usuario = await Usuarios.findOne({where:{email}});
  console.log("Usuario",usuario)
  if(!usuario)
  {
    return res.render('auth/recovery',{
      pagina:'Recupera tu acceso a Bienes Raices',
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
    }
    )
  }
  usuario.token = generarId();
  await usuario.save();
  console.log("Nuevo texto")
  emailRecuperar({//Envia el correo al usuario para que este vaya a ingresar la contraseña
    email,
    nombre: usuario.nombre,
    token: usuario.token
  })
  //Mostrar mensaje de confirmacion
  res.render('templates/mensaje',{
    pagina:'Reestablece tu Passwordf',
    mensaje:'Hemos enviado un email con las instrucciones'
  })
}
const newPass = async (req,res)=>{
    await check('password').notEmpty().isLength(6).withMessage("No cumple el minimo numero de valores").run(req)
    let resultado = validationResult(req);
    if(!resultado.isEmpty()){
      return res.render('auth/reset-password',{
        pagina:'Reestablece tu password',
        csrfToken: req.csrfToken(),
        errores: resultado.array(),

      })
    }
    const {token} = req.params;
    const {password} = req.body;
    const usuario = await Usuarios.findOne({where:{token}});
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(password,salt);
    usuario.token=null;
    await usuario.save();
    res.render('auth/confirmar_cuenta',{
      pagina:'Password reestablecido',
      mensaje:'El passwords se ha cambiado con exito'
    })
}
const comprobarToken = async(req,res) =>{
  const {token} =req.params;
  const usuario = await Usuarios.findOne({where:{token}});
  console.log("comprobartoken")
  console.log(usuario);
  if(!usuario){
    return res.render('auth/confirmar_cuenta',
    {
      pagina:'Reestablece tu Password',
      mensaje:'Hubo un error al validr tu información,intenta de nuevo',
      error:true
    })

  }
  res.render('auth/reset-password',{
    pagina:'Reestablece tu password',
    csrfToken: req.csrfToken()
  })

}

const confirmar = async (req,res)=>{
  const {token} = req.params;
  const usuario = await Usuarios.findOne({where:{token}});
  console.log(usuario);
  if(!usuario){
    return res.render('auth/confirmar_cuenta',{
      pagina:"Error al confirmar tu cuenta",
      mensaje: 'Hubo un error al confirmar tu cuenta, intenta de nuevo',
      error:true
    })
  }
  //Confirmar cuenta
  usuario.token=null;
  usuario.confirmado = true;
  await usuario.save();

  res.render('auth/confirmar_cuenta',{
    pagina:'Cuenta confirmada',
    mensaje:'La cuenta se confirmo correctamente',
    error:false,
  })

}
const ReedAll = async(req,res)=>{
  const mensaje = await Usuarios.findAll();
  res.render('lista',{})
}
const eliminar_tabla = async(req,res)=>{
  try{
    const mensaje = await Usuarios.drop();
    res.send({mensaje:"Producto eliminado"});
  }catch(error)
  {
    res.send({mensaje:"Hubo un error al eliminar la tabla"})
  }
}
const mensaje = (req,res)=>{
  res.render('template/mensaje',{
  })
}

export {newPass,confirmar,mensaje,formularioLogin,formularioRegistro,resetPassword,loginpasswordrecovery,registrando,comprobarToken}