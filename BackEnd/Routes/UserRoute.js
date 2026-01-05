import express from 'express';
import { loginUser, registerUser, getUserProfile, updateUserProfile } from '../Controllers/UserController.js';
import authUser from '../Middleware/Auth.js'

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
//userRouter.post('/admin', adminLogin) 
userRouter.get("/profile", authUser, getUserProfile);
userRouter.put("/profile", authUser, updateUserProfile);



export default userRouter;