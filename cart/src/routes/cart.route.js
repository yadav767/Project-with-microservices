import { Router } from "express";
import createAuthMiddleware from '../middlewares/authMiddleware.js'
import cartController from "../controllers/cart.controller.js";
import validations from "../middlewares/validator.middleware.js";

const cartRouter = Router()

cartRouter.post("/item",
    validations.createCartValidationRules,
    createAuthMiddleware(["user"]),
    cartController.createCart
)

cartRouter.patch("/item/:productId",
    validations.updateCartValidationRules,
    createAuthMiddleware(["user"]),
    cartController.updateItemQuantity
)

cartRouter.get("/",
    createAuthMiddleware(["user"]),
    cartController.getCart
)

cartRouter.delete("/item/:productId",
    createAuthMiddleware(["user"]),
    cartController.deleteItem
)

cartRouter.delete("/",
    createAuthMiddleware(["user"]),
    cartController.removeAllItemFromCart
)

export default cartRouter