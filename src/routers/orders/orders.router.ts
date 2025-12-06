import express from "express"
import { protect } from "../../middlewares/auth.middleware.js"
import { cancelOrder, createOrder, getAllOrders, getDeliveredOrders, getOrderStatus, getPendingOrders } from "../../controllers/orders/orders.controller.js"
import { redisCachingMiddleware } from "../../middlewares/redis.middleware.js"

const router = express.Router()

router.post("/create", protect, createOrder)
router.get("/getPendingOrders", protect, redisCachingMiddleware({ ttlSeconds: 300 }), getPendingOrders)
router.get("/getDeliveredOrders", protect, redisCachingMiddleware({ ttlSeconds: 300 }), getDeliveredOrders)
router.get("/getOrderStatus/:id", protect, redisCachingMiddleware({ ttlSeconds: 300 }), getOrderStatus)
router.get('/getAllOrders', protect, redisCachingMiddleware({ ttlSeconds: 300 }), getAllOrders)
router.post("/cancelOrder/:id", protect, cancelOrder)

export default router