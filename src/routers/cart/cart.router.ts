import express from "express"
import { protect } from "../../middlewares/auth.middleware.js"
import { addToCart } from "../../controllers/cart/cart.controller.js"

const router = express.Router()

router.post("/add", protect, addToCart)

export default router