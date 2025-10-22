import express from "express"
import { filterProductsByQuery, getProductById, getProducts, newProducts, searchProductsByQuery } from "../../controllers/product/product.controller.js"
import { redisCachingMiddleware } from "../../middlewares/redis.middleware.js"

const router = express.Router()

router.get("/get-products", getProducts)
router.get("/get-product/:id", getProductById)
router.get("/search", redisCachingMiddleware({ttlSeconds:300}), searchProductsByQuery)
router.get("/filter", redisCachingMiddleware({ttlSeconds:300}), filterProductsByQuery)
router.get("/new", newProducts)

export default router