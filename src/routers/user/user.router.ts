import express from "express"
import { protect } from "../../middlewares/auth.middleware.js"
import { addAddress, profile } from "../../controllers/user/user.controller.js"
import { redisCachingMiddleware } from "../../middlewares/redis.middleware.js"

const router = express.Router()

router.get("/me", protect,redisCachingMiddleware({ttlSeconds:300}), profile)
router.post("/add-address", protect, addAddress)

export default router