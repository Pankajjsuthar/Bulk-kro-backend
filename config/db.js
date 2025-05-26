const mongoose = require("mongoose")
require('dotenv').config();

const db = process.env.MONGODB_URI;console.log(db);

const connectDB = async()=>{
    try{
        await mongoose.connect(db);
        console.log("MongoDB connected.");
    }
    catch{
        console.log("Failed to connect with MongoDB.");
    }
};

module.exports = connectDB;