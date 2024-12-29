import dotenv from 'dotenv'
import mongoose from 'mongoose';

dotenv.config({path:"./.env"})






const connectDB= async () => {
    try {
        const resp =mongoose.connect("mongodb+srv://arkabasak62:1234@cluster0.i3bju.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
        if (resp) {
            console.log("monog db connected")
        }
    } catch (error) {
        console.log(error)
    }
}

export {connectDB}
