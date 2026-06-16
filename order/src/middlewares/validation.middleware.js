import { body, validationResult } from 'express-validator'

const responseWithValidationErrors = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next()
}


const createOrderValidation = [
    body('shippingAddress.street')
        .isString()
        .withMessage("Street must be string !")
        .notEmpty()
        .withMessage("Steet is required !"),
    body("shippingAddress.city")
        .isString()
        .withMessage("City is required !")
        .notEmpty()
        .withMessage("City is required !"),
    body("shippingAddress.state")
        .isString()
        .withMessage("State must be string !")
        .notEmpty()
        .withMessage("State is required !"),
    body("shippingAddress.country")
        .isString()
        .withMessage("Country must be string !")
        .notEmpty()
        .withMessage("Country is required !"),
    body("shippingAddress.pincode")
        .isString()
        .withMessage("Pincode must be string !")
        .notEmpty()
        .withMessage("Pincode is required !"),
    responseWithValidationErrors
]
export default { createOrderValidation }