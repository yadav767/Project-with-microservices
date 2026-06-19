import 'dotenv/config'
import app from "./src/app.js";
import connectDB from './src/db/db.js';

connectDB()

app.listen(3004,()=>{
    console.log("Payment service is running at the port 3004 !");
})