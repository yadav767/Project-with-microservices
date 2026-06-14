import mongoose from "mongoose";

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to DB !");
    } catch (error) {
        console.log("Error connecting to the DB !", error);
    }
}

export default connectDB