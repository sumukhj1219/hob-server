import express from "express"
import { allCollections, collectionsProducts } from "../../controllers/collections/collections.controller.js"

const router = express.Router()

router.get("/all", allCollections)
router.get("/:collectionName", collectionsProducts)

export default router