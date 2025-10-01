import express from "express"
import { createProduct, deleteProduct, updateProduct } from "../../../controllers/admin/product/product.contoller.js"
import { protect } from "../../../middlewares/auth.middleware.js"
import { authorize } from "../../../middlewares/authorize.middleware.js"


const router = express.Router()

router.post("/create-product", protect, authorize("ADMIN"), createProduct)
router.post("/delete-product", protect, authorize("ADMIN"), deleteProduct)
router.post("/update-product", protect, authorize("ADMIN"), updateProduct)



export default router