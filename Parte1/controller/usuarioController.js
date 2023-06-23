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
const formularioRegistro = (req,res)=>{
  res.render('auth/registro',{
    pagina:'Crear Cuenta'
  })
};
const loginpasswordrecovery = (req,res)=>{
  res.render('auth/recovery',{
    pagina:'Recuperar Contraseña'
  })
}

export {formularioLogin,formularioRegistro,loginpasswordrecovery}