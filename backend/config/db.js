// const express = express();
const mongoose = require("mongoose");
require("dotenv").config();
const connection = mongoose.connect(`${process.env.mongo}application`);
module.exports = { connection };
