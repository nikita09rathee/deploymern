const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true,unique:true },
    password: { type: String, required: true },
    username: { type: String, required: true },
    address: { type: String },
    phone: { type: String },

    // profile:{type:String}
     profile: { type: String } 
});



const UserModel = mongoose.model("user", userSchema);
module.exports = {UserModel};