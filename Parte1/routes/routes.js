import express from "express"
const router = express.Router();

router.get("/holas",(req,res)=>{
  res.json({msg:"hola"});
})
router.get("/dos",(req,res)=>{
  res.send("que haces");
})
export default router;