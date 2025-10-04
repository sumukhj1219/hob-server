import express from "express"
import { protect } from "../../middlewares/auth.middleware.js"
import { addAddress, profile } from "../../controllers/user/user.controller.js"

const router = express.Router()

router.get("/me", protect, profile)
router.post("/add-address", protect, addAddress)

export default router