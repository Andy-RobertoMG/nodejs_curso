import Usuarios from "../models/Usuarios.js";
import pkg from "express-validator";
import { generarId } from "../helpers/tokens.js";
import { emailRegistro } from "../helpers/tokens.js"; 
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
            email
          })
  }))
  
};
const loginpasswordrecovery = (req,res)=>{
  res.render('auth/recovery',{
    pagina:'Recuperar Contraseña'
  })
}
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
          password
        })
        return
      }
      const existeUsuario = await Usuarios.findOne({where:{email:req.body.email}});
      if(existeUsuario){
        res.render('auth/registro',{
          pagina:'Crear Cuenta',
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
export {mensaje,formularioLogin,formularioRegistro,loginpasswordrecovery,registrando}