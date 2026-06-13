import { body, validationResult } from 'express-validator'

const responseWithValidationErrors = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next()
}
const createProductValidationRules = [
    body('title')
        .isString()
        .trim()
        .notEmpty()
        .withMessage('Title is required'),
    body('description')
        .optional()
        .isString()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description cannot exceed 500 characters'),
    body('priceAmount')
        .notEmpty()
        .withMessage('Price amount is required')
        .bail()
        .isFloat({ gt: 0 }).withMessage('Price must be a positive number'),

    body('priceCurrency')
        .optional()
        .isString()
        .withMessage('Price currency must be a string')
        .isIn(['USD', 'INR'])
        .withMessage('Price currency must be one of USD, INR'),
    responseWithValidationErrors
]

export default  createProductValidationRules 
