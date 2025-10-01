import express, { type Application } from "express"

const app: Application = express()

app.get("/",(_,res)=>{
    res.json({message:"Hob server is up"})
})

export default app