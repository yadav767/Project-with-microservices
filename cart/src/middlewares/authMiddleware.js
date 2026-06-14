import jwt from 'jsonwebtoken'

function createAuthMiddleware(role = ["user"]) {
    return function authMiddleware(req, res, next) {
        const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized no token provided !"
            })
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            if (!role.includes(decoded.role)) {
                return res.status(403).json({
                    message: "Forbidden : Insufficient permission !"
                })
            }
            req.user = decoded
            next()
        } catch (error) {
            res.status(500).json({
                message: "Error occured ",
                error
            })
        }
    }
}

export default createAuthMiddleware