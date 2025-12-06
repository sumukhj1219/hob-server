import express from "express"
import { protect } from "../../middlewares/auth.middleware.js"
import { addToCart, decreaseCartItemQuantity, deleteFromCart, getCartProducts, increaseCartItemQuantity } from "../../controllers/cart/cart.controller.js"
import { redisCachingMiddleware } from "../../middlewares/redis.middleware.js"

const router = express.Router()

router.post("/add", protect, addToCart)
router.post("/delete", protect, deleteFromCart)
router.get("/getProducts", protect, redisCachingMiddleware({ttlSeconds:300}), getCartProducts)
router.post("/increaseCartItem", protect, increaseCartItemQuantity)
router.post("/decreaseCartItem", protect, decreaseCartItemQuantity)

export default router