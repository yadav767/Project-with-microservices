import express from "express";
import paymentRoute from "./routes/payment.routes.js";
import cookieParser from "cookie-parser";

const app = express()

app.use(cookieParser())
app.use(express.json())


app.use("/api/payment",paymentRoute)


export default app