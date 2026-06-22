import 'dotenv/config'

import app from "./src/app.js";
import http from 'http'


import { initSocketServer } from "./src/sockets/socket.server.js";


const httpServer = http.createServer(app);    

initSocketServer(httpServer);


httpServer.listen(3005,()=>{
    console.log("AI Buddy is running at the port 3005");
})