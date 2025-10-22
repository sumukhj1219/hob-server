import type { NextFunction, Request, Response } from "express"
import { redis } from "../config/redis.js"
import { AppError } from "./error.middleware.js"

export function redisCachingMiddleware({ ttlSeconds = 300 } = {}) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const cacheKey = `cache:${req.originalUrl}`;
            const cachedData = await redis.get(cacheKey);

            if (cachedData) {
                return res.status(200).json(JSON.parse(cachedData));
            }

            const originalJson = res.json.bind(res);

            res.json = (data: any) => {
                redis.set(cacheKey, JSON.stringify(data), { EX: ttlSeconds }).catch(console.error);

                return originalJson(data);
            };

            next();
        } catch (error) {
            throw new AppError("Redis error", 500)
            next();
        }
    };
}
