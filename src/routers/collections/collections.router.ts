import express from "express"
import { allCollections, collectionsProducts } from "../../controllers/collections/collections.controller.js"
import { redisCachingMiddleware } from "../../middlewares/redis.middleware.js"

const router = express.Router()

router.get("/all", redisCachingMiddleware({ttlSeconds:300}), allCollections)
router.get("/:collectionName", redisCachingMiddleware({ttlSeconds:300}), collectionsProducts)

export default router