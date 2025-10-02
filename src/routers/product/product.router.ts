import express from "express"
import { filterProductsByQuery, getProductById, getProducts, newProducts, searchProductsByQuery } from "../../controllers/product/product.controller.js"

const router = express.Router()

router.get("/get-products", getProducts)
router.get("/get-product/:id", getProductById)
router.get("/search", searchProductsByQuery)
router.get("/filter", filterProductsByQuery)
router.get("/new", newProducts)

export default router