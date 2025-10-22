import { redis } from "../config/redis.js";

export async function getFromCache(cacheKey: string) {
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
  return null;
}