import express from "express"
import { protect } from "../../middlewares/auth.middleware.js"
import { createOrder } from "../../controllers/orders/orders.controller.js"

const router = express.Router()

router.post("/create", protect, createOrder)

export default router