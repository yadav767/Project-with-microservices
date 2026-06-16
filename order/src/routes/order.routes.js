import { Router } from "express";
import orderController from "../controllers/order.controller.js";
import createAuthMiddleware from "../middlewares/authMiddleware.js";
import validationMiddleware from "../middlewares/validation.middleware.js";

const orderRoute = Router()


orderRoute.post("/",
    createAuthMiddleware(["user"]),
    validationMiddleware.createOrderValidation,
    orderController.createOrder
)


export default orderRoute