import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/caregiverRoute.js'
import userRouter from './routes/userRoute.js'

//config 
dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000
connectDB()
connectCloudinary()


//middlewares
app.use(express.json())
app.use(cors());

//API endpoint
app.use('/api/admin',adminRouter)
app.use('/api/caregiver',doctorRouter)
app.use('/api/user', userRouter)

app.get('/', (req, res)=> {
    res.send('API WORKING')
})

app.listen(PORT, ()=> {
    console.log(`App is running at ${PORT}`);
    
})