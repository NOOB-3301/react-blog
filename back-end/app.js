import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express();
// const PORT = process.env.PORT || 8080

app.use(cors({
    origin:"*"
}))
app.use(express.json({extend: false}));



app.use("/",(req,res)=>{res.send('express running , mongo running')})
//routes importing
import {userRouter} from "./routes/user.routes.js"
import { articleRouter } from './routes/article.routes.js';

//routes declare
app.use("/api/auth",userRouter)
app.use("/api/article",articleRouter)
export {app}