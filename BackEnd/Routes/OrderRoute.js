import express from 'express' 
import { placeOrder, allOrders, userOrders, updateStatus, placeOrderCard } from '../Controllers/OrderController.js'
import adminAuth from '../Middleware/AdminAuth.js'
import authUser from '../Middleware/Auth.js'

const orderRouter = express.Router()

// Admin Panel Features
orderRouter.post('/list', allOrders)
orderRouter.post('/status', adminAuth, updateStatus)

// Payment Features
orderRouter.post('/place', authUser, placeOrder)
orderRouter.post('/card', authUser, placeOrderCard);


// User Features
orderRouter.post ('/userorders', authUser, userOrders)

export default orderRouter