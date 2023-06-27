import express from "express";
import router from "./routes/routes.js";
import livereload from "livereload";
import connectLivereload from "connect-livereload";
import path from "path";
import db from './config/db.js'
import csurf from "csurf";
import cookieParser from 'cookie-parser'
const app = express()
//Habilida lectura de datos de formulario 
app.use(express.urlencoded({extended:true}));
//Habilitar cookie parser 
app.use(cookieParser())
//Habilita la utilizacion de cookies
app.use(csurf({cookie:true}))//Con esto el request no viene desde la terminal o desde otra aplicacion sino desde nuestro dominio
try{
  await db.authenticate();
  db.sync()
  // console.log("Coneccion correcta");
}catch(error){
  console.log(error);
}
const publicDirectory = path.join("C:\Users\Andy\Documents\Trabajo\Estudio\Nodejs\nodejs_curso\Parte1",'views');
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(publicDirectory);
liveReloadServer.server.once("connection",()=>{
  setTimeout(()=>{
    liveReloadServer.refresh("/")
    // console.log("funciona123")
  },100)
})
app.set("views",'./views');
//Habilitar Pug
app.set('view engine',"pug");
//Carpeta publica
app.use(connectLivereload());
app.use(express.static('public'));

app.use('/auth',router);
app.listen(process.env.PORT||3000,()=>{
  console.log("Funciona");
});