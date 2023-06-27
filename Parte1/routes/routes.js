import express from "express"
import {confirmar, formularioLogin,formularioRegistro,loginpasswordrecovery, mensaje, registrando, resetPassword} from '../controller/usuarioController.js'
const router = express.Router();

router.get("/login",formularioLogin);
router.get("/login2",(req,res)=>{
  res.render("./auth/login2")
});
router.get('/recovery',loginpasswordrecovery);
router.post('/recovery',resetPassword);
router.get("/registro",formularioRegistro)
router.post("/registro",registrando);
router.get("/confirmar/:token",confirmar);
router.get("/mensaje",mensaje)
export default router;