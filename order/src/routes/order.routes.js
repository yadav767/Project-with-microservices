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

orderRoute.get("/me",createAuthMiddleware(["user"]),orderController.getMyOrders)


orderRoute.get("/:id",createAuthMiddleware(["user","admin"]),orderController.getMyOrderById)

orderRoute.post("/:id/cancel",createAuthMiddleware(["user"]),orderController.cancelOrderById)

orderRoute.patch("/:id/address",
    createAuthMiddleware(["user"]),
    validationMiddleware.updateOrderValidation,
    orderController.updateOrderAddress
)


export default orderRoute