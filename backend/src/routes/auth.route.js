import { Router } from "express";
import authController from '../controllers/auth.controller.js'
import validators from "../middlewares/validator.middleware.js"
import authMiddleware from "../middlewares/auth.middleware.js";

const authRoute = Router()

//Register 
authRoute.post("/register", validators.registerUserValidation, authController.registerUserController)

//Login
authRoute.post("/login", validators.loginUserValidation, authController.loginUserController)

//Get Me
authRoute.get("/me", authMiddleware.authMiddleware, authController.getMeController)

//Logout
authRoute.get("/logout",authController.logoutUserController)

export default authRoute