import express from "express"
import {comprobarToken, confirmar, formularioLogin,formularioRegistro,loginpasswordrecovery, mensaje, registrando, resetPassword,newPass} from '../controller/usuarioController.js'
const router = express.Router();

router.get("/login",formularioLogin);
router.get("/login2",(req,res)=>{
  res.render("./auth/login2")
});
/**
 * Primero se da clic a recuperar cuenta donde la persona ingresara su correo
 */
router.get('/recovery',loginpasswordrecovery);
/**
 * Una vez la persona haya ingresado su correo se creara un token en el servidor y este mismo sera enviado en el correo el cual es de un solo uso, 
 * aparte se utiliza el scrft para que solo se pueda ingresar desde la pagina, el correo lleva a un link de la pagina donde estara el token para ingresar ademas del token scrft como input
 * para verificar que eres tu.
 */
router.post('/recovery',resetPassword);
/**
 * Aqui se muestra la pagina para ingresar la nueva contraseña
 */
router.get('/recovery/:token',comprobarToken);
/**
 * Al enviarse la nueva contraseña el token del usuario es eliminaod puesto que es de un unico uso.
 */
router.post('/recovery/:token',newPass);
router.get("/registro",formularioRegistro)
router.post("/registro",registrando);
router.get("/confirmar/:token",confirmar);
router.get("/mensaje",mensaje)
export default router;