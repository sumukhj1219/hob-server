import express from "express"
import { bulkCreateProducts, createProduct, deleteProduct, getProductById, getProducts, updateProduct } from "../../../controllers/admin/product/product.contoller.js"
import { protect } from "../../../middlewares/auth.middleware.js"
import { authorize } from "../../../middlewares/authorize.middleware.js"


const router = express.Router()

router.post("/create-product", protect, authorize("ADMIN"), createProduct)
router.post("/delete-product", protect, authorize("ADMIN"), deleteProduct)
router.post("/update-product", protect, authorize("ADMIN"), updateProduct)
router.post("/bulk-create-products", protect, authorize("ADMIN"), bulkCreateProducts)

router.get("/get-products", protect, authorize("ADMIN"), getProducts)
router.get("/get-product/:id", protect, authorize("ADMIN"), getProductById)

export default router