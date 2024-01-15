const express = require("express");
const bcrypt = require('bcrypt');
const { UserModel } = require("../models/user.model");
const userController = express.Router();
const mongoose = require("mongoose");
var jwt = require('jsonwebtoken');
//signup
userController.post("/signup", async (req, res) => {
    try {
        const { name, email, password, username,profile } = req.body;
        console.log(req.body);
        if (!name || !email || !password||!username) {
            res.status(400);
            throw new Error("Please enter all details");
        }

        const exists = await UserModel.findOne({ username: username });
        if (exists) {
            res.status(400);
            throw new Error({ message: "User already exists" });
        } else {
            const hash = await bcrypt.hash(password, 5);
            const data = await UserModel.create({ name, email, password: hash, username });
            console.log(data);
            res.status(201).send({ message: "Account created successfully" ,data:data});
        }
    } catch (error) {
        console.error(error);
        res.status(400).send({ message: "User not created" });
    }
});
//login
userController.post("/login", async (req, res) => {
    
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email:email });
    if (!user) {
        res.send({ message: "signup first" }).status(400);
    }
    else {
        console.log(user);
        const hashed_pass = user?.password;
        console.log(hashed_pass);
        bcrypt.compare(password, hashed_pass, function (err, result) {
            if (err) {
                res.send({ message: "invalid credentials"}).status(400)
            }
            else {
                // console.log(user[0]._id);
                var token = jwt.sign({ userId: user._id }, 'live');
                res.send({ message: "logged in succesfully", token: token, data: user }).status(200);
            }
        });
    }

});

userController.put("/update/:userId", async (req, res) => {
    const userId = req.params.userId;
    console.log(userId);
    try {
        const {  name, email, password, username,address, phone ,profile} = req.body;

        // You can add additional validation if needed
        if ( !name || !email || !password || !username) {
            res.status(400).send({ message: "Please provide all required details" });
            return;
        }

        
         const ObjectId = mongoose.Types.ObjectId;
        const objectIdUserId = new ObjectId(userId);
        const user = await UserModel.findById(objectIdUserId);

        if (!user) {
            res.status(404).send({ message: "User not found" });
            return;
        }

       
        user.name = name;
        user.email = email;
        user.password = await bcrypt.hash(password, 5); 
        user.username = username;
        user.profile = profile; 
        user.address = address;
        user.phone = phone;
        // Save the updated user
        await user.save();

        res.status(200).send({ message: "User credentials updated successfully", data: user });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error updating user credentials" });
    }
});


module.exports={userController}