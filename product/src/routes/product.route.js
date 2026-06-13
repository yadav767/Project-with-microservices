import { Router } from "express";
import multer from "multer";
import createAuthMiddleware from "../middlewares/authMiddleware.js";
import productController from '../controller/product.controller.js'
import createProductValidationRules from '../middlewares/validator.middleware.js'

const productRoute = Router()
const upload = multer({ storage: multer.memoryStorage() })


productRoute.post("/",
    createAuthMiddleware(["admin", "seller"]),
    upload.array('images', 5),
    createProductValidationRules,
    productController.createProduct
)

productRoute.get("/", productController.getProducts)

productRoute.get("/seller", createAuthMiddleware(["seller"]), productController.getProductsBySeller)

productRoute.patch("/:id", createAuthMiddleware(['seller']), productController.updateProduct)

productRoute.delete("/:id", createAuthMiddleware(['seller']), productController.deleteProduct)

productRoute.get("/:id", productController.getProductById)

export default productRoute