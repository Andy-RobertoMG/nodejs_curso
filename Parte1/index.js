import express from "express";
import router from "./routes/routes.js";
const app = express()

//Habilitar Pug
app.set('view engine',"pug");

app.set("views",'./views');
app.use('/auth',router);
app.listen(3000,()=>{
  console.log("Funciona");
});