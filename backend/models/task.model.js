const mongoose=require("mongoose");
const taskSchema=mongoose.Schema({
      
      title:{type:String,required:true},
      description:{type:String,required:true},
     createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
      

});
const TaskModel=mongoose.model("task",taskSchema);
module.exports={TaskModel};