import { Server } from "socket.io";
import jwt from 'jsonwebtoken'
import cookie from 'cookie'
import agent from "../agent/agent.js";


async function initSocketServer(httpServer) {
    const io = new Server(httpServer, {})


    io.use((socket, next) => {
        const cookies = socket.handshake.headers?.cookie;

        const { token } = cookies ? cookie.parse(cookies) : {};

        if (!token) {
            return next(new Error("Token Not Found"))
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decoded;
            socket.token = token
            next();
        } catch (err) {
            return next(new Error("Invalid Token"))
        }

    })


    io.on("connection", (socket) => {
        socket.on("message",async (data) => {
            const agentResponse = await agent.invoke({
                messages: [
                    {
                        role: "user",
                        content: data
                    }
                ]
            }, {
                metadata: {
                    token: socket.token
                }
            })
        })
    })
}

export { initSocketServer } 