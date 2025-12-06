import express from "express"
import { bulkCreateProducts, bulkDeleteProducts, createProduct, deleteProduct, updateProduct } from "../../../controllers/admin/product/product.contoller.js"
import { protect } from "../../../middlewares/auth.middleware.js"
import { authorize } from "../../../middlewares/authorize.middleware.js"
import { getProductById, getProducts, searchProductsByQuery } from "../../../controllers/product/product.controller.js"
import { redisCachingMiddleware } from "../../../middlewares/redis.middleware.js"

const router = express.Router()

router.post("/create-product", protect, authorize("ADMIN"), createProduct)
router.post("/delete-product", protect, authorize("ADMIN"), deleteProduct)
router.post("/update-product", protect, authorize("ADMIN"), updateProduct)
router.post("/bulk-create-products", protect, authorize("ADMIN"), bulkCreateProducts)
router.post("/bulk-delete-products", protect, authorize("ADMIN"), bulkDeleteProducts)

router.get("/get-products", protect, authorize("ADMIN"),  getProducts)
router.get("/get-product/:id", protect, authorize("ADMIN"), getProductById)
router.get("/search", protect, authorize("ADMIN"), searchProductsByQuery)

export default router