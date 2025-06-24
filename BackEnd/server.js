import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import connectDB from './Config/MongoDB.js';
import connectCloudinary from './Config/Cloudinary.js';
import userRouter from './Routes/UserRoute.js';
import productRouter from './Routes/ProductRoute.js';
import cartRouter from './Routes/CartRoute.js';
import orderRouter from './Routes/OrderRoute.js';
import serverless from 'serverless-http';



// App Config 
const app = express()
const port = process.env.PORT || 4000
await connectDB();
connectCloudinary()


//Middlewares
app.use(express.json())
app.use(cors())


//API Endpoints
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)


app.get('/', (req, res) => {
    res.send("API Working")
})

app.listen(port, ()=> console.log('Server started on PORT : ' + port ))