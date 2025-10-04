import express from "express"
import { categories, categoryProducts, categoryWiseTotalProducts } from "../../controllers/category/category.controller.js"

const router = express.Router()

router.get("/all", categories)
router.get("/name/:name", categoryProducts)
router.get("/totalProducts", categoryWiseTotalProducts)

export default router