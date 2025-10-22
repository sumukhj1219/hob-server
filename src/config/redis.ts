import { createClient } from 'redis';
import { AppError } from '../middlewares/error.middleware.js';
import { ENV } from './env.js';

export const redis = createClient({
    username: ENV.REDIS_USERNAME,
    password: ENV.REDIS_PASSWORD,
    socket: {
        host: ENV.REDIS_HOST,
        port: ENV.REDIS_PORT
    }
});

redis.on('error', err => new AppError("Unable to connect redis client"));

await redis.connect();


