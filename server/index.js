import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'

const PORT=process.env.PORT || 5000
const app=express()
app.use(express.json())
app.use(cookieParser())
app.use(cors())


const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL)
        app.listen(PORT,()=>console.log(`Server started on port = ${PORT}`))
    }catch (e) {
        console.log('ошибка при запуске сервера',e)
    }
}

start()

