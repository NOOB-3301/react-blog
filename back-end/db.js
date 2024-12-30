import dotenv from 'dotenv'
import mongoose from 'mongoose';

dotenv.config({path:"/.env"})
console.log("this is env variable",process.env.CONNECTION_URL)

const connectDB= async () => {
    try {
        const resp =mongoose.connect(process.env.CONNECTION_URL)
        if (resp) {
            console.log("monog db connected")
        }
    } catch (error) {
        console.log(error)
    }
}

export {connectDB}
