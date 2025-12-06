import express from "express"
import { categories, categoryProducts, categoryWiseTotalProducts } from "../../controllers/category/category.controller.js"
import { redisCachingMiddleware } from "../../middlewares/redis.middleware.js"

const router = express.Router()

router.get("/all", redisCachingMiddleware({ ttlSeconds: 300 }), categories)
router.get("/:name", redisCachingMiddleware({ ttlSeconds: 300 }), categoryProducts)
router.get("/totalProducts", redisCachingMiddleware({ ttlSeconds: 300 }), categoryWiseTotalProducts)

export default router