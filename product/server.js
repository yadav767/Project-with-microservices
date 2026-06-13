import 'dotenv/config'

import app from "./src/app.js";
import connectDB from "./src/db/db.js";

connectDB()

app.listen(3001,()=>{
    console.log("Product is running at the port 3001...");
})