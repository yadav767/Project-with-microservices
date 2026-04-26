import userModel from "../models/user.model.js";
import jwt from 'jsonwebtoken'
import config from "../config/config.js";
import redis from "../config/redis.js";

async function authMiddleware(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    try {
        const isTokenBlackListed=await redis.get(`blacklist:${token}`)
        if(isTokenBlackListed){
            return res.status(401).json({ message: "Unauthorized" })
        }

        const decoded = jwt.verify(token, config.JWT_SECRET)
        const user = decoded
        req.user = user
        next()
    } catch (error) {
        res.status(401).json({
            message: "Unauthorized",
            error
        })
    }
}

export default { authMiddleware }