const mongoose = require('mongoose');

const DB_URI = "mongodb+srv://r0527150931_db_user:rn216526889#$@cluster0.r1sy07k.mongodb.net/";

const connectDB = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log("Connected to MongoDB successfully!");
    } catch (error) {
        console.error("Failed to connect to MongoDB", error);
    }
};

module.exports = connectDB;