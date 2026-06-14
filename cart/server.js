import 'dotenv/config'
import app from './src/app.js'
import connectDB from './src/db/db.js';

connectDB()


app.listen(3002, () => {
    console.log("Cart is running at the port 3002 !");
})