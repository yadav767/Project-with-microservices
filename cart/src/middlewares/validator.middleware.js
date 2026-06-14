import { body, param, validationResult } from 'express-validator'
import mongoose from 'mongoose'

const responseWithValidationErrors = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        console.log("Validation errors:", errors.array())  
        return res.status(400).json({ errors: errors.array() });
    }
    next()
}
const createCartValidationRules = [
    body('productId')
        .isString()
        .withMessage('Product ID must be a string')
        .notEmpty()
        .withMessage('Product ID is required')
        .custom((value) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error('Invalid Product ID format')
            }
            return true  
        }),
    body('qty')
        .isInt({ min: 1 })
        .withMessage('Quantity must be an integer greater than 0'),
    responseWithValidationErrors
]
const updateCartValidationRules = [
    param('productId')
        .isString()
        .withMessage('Product ID must be a string')
        .notEmpty()
        .withMessage('Product ID is required')
        .custom((value) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error('Invalid Product ID format')  // ✅
            }
            return true
        }),
    body('qty')
        .isInt({ min: 1 })
        .withMessage('Quantity must be an integer greater than 0'),
    responseWithValidationErrors
]

export default { createCartValidationRules, updateCartValidationRules } 
