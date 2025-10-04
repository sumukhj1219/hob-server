import express from "express"
import { protect } from "../../../middlewares/auth.middleware.js"
import { authorize } from "../../../middlewares/authorize.middleware.js"
import { addCategory, deleteCategory } from "../../../controllers/admin/category/category.controller.js"

const router = express.Router()

router.post("/add", protect, authorize("ADMIN"), addCategory)
router.post("/delete/:id", protect, authorize("ADMIN"), deleteCategory)

export default router