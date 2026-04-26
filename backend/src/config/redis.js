import {Redis} from 'ioredis';
import config from './config.js';

const redis =new Redis({
    host:config.REDIS_HOST,
    port:config.REDIS_PORT,
    password:config.REDIS_PASSWORD
})

redis.on("connect",()=>{
    console.log("Connected to redis...");

})

export default redis