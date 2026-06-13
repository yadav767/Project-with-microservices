import dotenv from "dotenv"
dotenv.config()

if (!process.env.MONGO_URI) {
    throw new Error("Please provide MONGO_URI srting ! ")
}

if (!process.env.JWT_SECRET) {
    throw new Error("Please provide JWT_SECRET srting ! ")
}

if (!process.env.REDIS_HOST) {
    throw new Error("Please provide REDIS_HOST srting ! ")
}

if(!process.env.REDIS_PORT) {
    throw new Error("Please provide REDIS_PORT srting ! ")
}

if(!process.env.REDIS_PASSWORD) {
    throw new Error("Please provide REDIS_PASSWORD srting ! ")
}

const config = {
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD
}

export default config