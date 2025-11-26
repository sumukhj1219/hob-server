import express from "express"
import { protect } from "../../middlewares/auth.middleware.js"
import { cancelOrder, createOrder, getAllOrders, getDeliveredOrders, getOrderStatus, getPendingOrders } from "../../controllers/orders/orders.controller.js"

const router = express.Router()

router.post("/create", protect, createOrder)
router.get("/getPendingOrders", protect, getPendingOrders)
router.get("/getDeliveredOrders", protect, getDeliveredOrders)
router.get("/getOrderStatus/:id", protect, getOrderStatus)
router.get('/getAllOrders', protect, getAllOrders)
router.post("/cancelOrder/:id", protect, cancelOrder)

export default router