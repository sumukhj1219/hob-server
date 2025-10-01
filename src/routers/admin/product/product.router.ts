import express from "express"
import { createProduct } from "../../../controllers/admin/product/product.contoller.js"
import { protect } from "../../../middlewares/auth.middleware.js"
import { authorize } from "../../../middlewares/authorize.middleware.js"


const router = express.Router()

router.post("/create-product", protect, authorize("ADMIN"), createProduct)

export default router