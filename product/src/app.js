import cookieParser from 'cookie-parser'
import express from 'express'
import productRoute from './routes/product.route.js'

const app = express()


app.use(express.json())
app.use(cookieParser())

app.use("/api/product",productRoute)

export default app
