const express=require("express");
const app=express();
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const cors = require("cors");
const {authenticate}=require("./middleware/authenticate")
const {taskController}=require("./controller/task.controller")
const { connection } = require("./config/db");
const {userController}=require("./controller/user.controller")
app.use(express.json());
app.use(cors({
      origin:["http://localhost:3000"]
}))
app.get("/",(req,res)=>{
      res.send("welcome");
}) 

//for tasks
app.use("/user", userController);
app.use(authenticate);
app.use("/task", taskController);
app.listen(8080,async()=>{
      try{
            await connection;
            console.log("db connected");
      }
      catch(error){
            console.log(error);
      }
})