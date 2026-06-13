import mongoose from "mongoose";

async function connectDB(){
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("DB is connected successfully...");
    } catch (error) {
        console.log("Failed to connect DB !" ,error);
    }
}

export default connectDB