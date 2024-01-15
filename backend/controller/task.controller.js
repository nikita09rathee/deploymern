const express = require("express");
const taskController = express.Router();
const { TaskModel } = require("../models/task.model");
const {UserModel}=require("../models/user.model")
//get request
taskController.get("/alltasks", async (req, res) => {
    
     try {
        const tasks = await TaskModel.find()
            .populate({
                path: 'createdBy',
            
                select: 'name email username profile', // Specify user fields
            })
            .select('title description createdBy'); // Specify task fields

        res.send(tasks);
    } catch (error) {
        res.status(500).send(error);
    }
})
//specific user tasks
taskController.get("/", async (req, res) => {
    try {
        const userId = req.userId;
        const tasks = await TaskModel.find({ createdBy: userId });
        res.send(tasks);
    } catch (error) {
        res.status(500).send(error);
    }
});
//post request

taskController.post("/create", async (req, res) => {
    try {
        const { title, description } = req.body;
        const userId = req.userId;

        if (!title || !description) {
            throw new Error("Title and description are required");
        }

        await TaskModel.create({ title, description, createdBy: userId });
        res.send({ message: "Your task is created" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error creating task" });
    }
});

//update

taskController.patch("/:taskId", async (req, res) => {
    const { taskId } = req.params;
    const payload = req.body;

    try {
        const userId = req.userId;
        const task = await TaskModel.findOne({ _id: taskId, createdBy: userId });

        if (!task) {
            return res.status(404).send({ message: "Task not found" });
        }

        await TaskModel.findByIdAndUpdate(taskId, payload);
        res.send({ message: "Task updated" });
    } catch (error) {
        res.status(500).send({ message: "Error updating task" });
    }
});
//delete

taskController.delete("/:taskId", async (req, res) => {
    const { taskId } = req.params;

    try {
        const userId = req.userId;
        const task = await TaskModel.findOne({ _id: taskId, createdBy: userId });

        if (!task) {
            return res.status(404).send({ message: "Task not found" });
        }

        await TaskModel.findByIdAndDelete(taskId);
        res.send({ message: "Task deleted" });
    } catch (error) {
        res.status(500).send({ message: "Error deleting task" });
    }
});
module.exports = { taskController };