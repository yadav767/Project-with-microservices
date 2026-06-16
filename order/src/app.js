import express from "express";
import cookieParser from "cookie-parser";
import orderRoute from "./routes/order.routes.js";
const app = express()

app.use(cookieParser())
app.use(express.json())


app.use("/api/order",orderRoute)

export default app