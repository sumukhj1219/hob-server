import express, { type Application } from "express"
import cors from "cors"
import authRouter from "./routers/auth/auth.router.js"
import adminProductRouter from "./routers/admin/product/product.router.js"
import { errorHandler } from "./middlewares/error.middleware.js"

const app: Application = express()

app.use(cors())
app.use(express.json())

app.get("/",(_,res)=>{
    res.json({message:"Hob server is up"})
})

app.use("/api/auth", authRouter)
app.use("/api/admin/product", adminProductRouter)

app.use(errorHandler)

export default app