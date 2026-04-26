import userModel from "../models/user.model.js"
import bcrypt from 'bcrypt'
import redis from "../config/redis.js"
import jwt from 'jsonwebtoken'
import config from '../config/config.js'

async function registerUserController(req, res) {
    const { username, email, password, fullName: { firstName, lastName } } = req.body

    const isUserAlreadyExist = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })
    if (isUserAlreadyExist) {
        return res.status(409).json({
            message: "Username or email already exists!"
        })
    }
    const hashPassword = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username,
        email,
        password: hashPassword,
        fullName: {
            firstName,
            lastName
        }
    })

    const token = jwt.sign({
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        addressess: user.addressess
    }, config.JWT_SECRET, {
        expiresIn: "1d"
    })

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000
    })

    res.status(200).json({
        message: "User registered successfully!",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            adresses: user.addressess
        }
    })
}

async function loginUserController(req, res) {
    try {
        const { username, email, password } = req.body
        const checkUser = await userModel.findOne({
            $or: [
                { username },
                { email }
            ]
        }).select("+password")

        if (!checkUser) {
            return res.status(404).json({
                message: "User not found!"
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password, checkUser.password)
        if (!isPasswordCorrect) {
            return res.status(404).json({
                message: "Invalid credentials!"
            })
        }

        const token = jwt.sign({
            id: checkUser._id,
            email: checkUser.email,
            username: checkUser.username,
            role: checkUser.role,
            addressess: checkUser.addressess
        }, config.JWT_SECRET, { expiresIn: "1d" })

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000
        })
        res.status(200).json({
            message: "User logged in successfully!",
            user: {
                id: checkUser._id,
                username: checkUser.username,
                email: checkUser.email,
                fullName: checkUser.fullName,
                role: checkUser.role,
                adresses: checkUser.addressess
            }
        })
    } catch (error) {
        res.status(400).json({
            message: "Chutiye dhang se kar!"
        })
    }
}

async function getMeController(req, res) {
    return res.status(200).json({
        message: "User fetched successfully!",
        user: req.user
    })
}

async function logoutUserController(req, res) {
    const token = req.cookies.token
    if (token) {
        await redis.set(`blacklist:${token}`, token, "EX", 24 * 60 * 60)
    }
    res.clearCookie("token",{
        httpOnly: true,
        secure: true,
    })
    res.status(200).json({
        message:"User logged out successfully!"
    })
}




export default {
    registerUserController, loginUserController, getMeController,logoutUserController
}