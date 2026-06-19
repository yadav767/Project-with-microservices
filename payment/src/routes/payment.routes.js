import { Router } from "express";
import createAuthMiddleware from "../middlewares/authMiddleware.js";
import paymentController from "../controllers/payment.controller.js"

const paymentRoute = Router()

paymentRoute.post("/create/:orderId",
    createAuthMiddleware(["user"]),
    paymentController.createPayment
)

paymentRoute.post("/verify",
    createAuthMiddleware(["user"]),
    paymentController.verifyPayment
)


export default paymentRoute