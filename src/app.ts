import express, { type Application } from "express"
import cors from "cors"
import authRouter from "./routers/auth/auth.router.js"
import adminProductRouter from "./routers/admin/product/product.router.js"
import adminCategoryRouter from "./routers/admin/category/category.router.js"
import productRouter from "./routers/product/product.router.js"
import categoryRouter from "./routers/category/category.router.js"
import userRouter from "./routers/user/user.router.js"
import { errorHandler } from "./middlewares/error.middleware.js"
import compression from 'compression';

const app: Application = express()

app.use(cors())
app.use(compression({
  threshold: 512            
}));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


app.get("/",(_,res)=>{
    res.json({message:"Hob server is up"})
})

app.use("/api/auth", authRouter)

app.use("/api/admin/product", adminProductRouter)
app.use("/api/admin/category", adminCategoryRouter)

app.use("/api/product", productRouter)
app.use("/api/category", categoryRouter)
app.use("/api/user", userRouter)

app.use(errorHandler)

export default app