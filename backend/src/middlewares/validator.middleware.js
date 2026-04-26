import { body, validationResult } from 'express-validator'

const responseWithValidationErrors = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next()
}


const registerUserValidation = [
    body("username")
        .isString()
        .withMessage("Username must be string.")
        .isLength({ min: 3 })
        .withMessage("Username must be atleast 3 character long "),
    body("email")
        .isEmail()
        .withMessage("Invalid email address"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be atleast 6 character long."),
    body("fullName.firstName")
        .isString()
        .withMessage("First name must be string.")
        .notEmpty()
        .withMessage("First name is required."),
    body("fullName.lastName")
        .isString()
        .withMessage("Last name must be string.")
        .notEmpty()
        .withMessage("Last name is required."),

    responseWithValidationErrors
]

const loginUserValidation = [
    body("username")
        .optional()
        .isString()
        .withMessage("Username must be string."),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be atleast 6 character long."),
    body("email")
        .optional()
        .isEmail()
        .withMessage("Invalid email address."),
    (req, res, next) => {
        if (!req.body.username && !req.body.email) {
            return res.status(400).json({ error: [{ msg: "Either email or username required !" }] })
        }
        responseWithValidationErrors(req, res, next)
    }

]

export default { registerUserValidation, loginUserValidation }