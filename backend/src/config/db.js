import mongoose from "mongoose";
import config from "../config/config.js"

async function connectDB(){
    try {
        await mongoose.connect(config.MONGO_URI)
        console.log("DB connected successfully...");
    } catch (error) {
        console.log("Error connecting DB",error);
    }
}

export default connectDB