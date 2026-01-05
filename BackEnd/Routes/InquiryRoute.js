import express from "express";
import { createInquiry, getAllInquiries, getUserInquiries } from "../Controllers/InquiryController.js";
import adminAuth from '../Middleware/AdminAuth.js'
import authUser from '../Middleware/Auth.js'

const userinquiryrouter = express.Router();

// Public route for submitting inquiry
userinquiryrouter.post("/create", authUser, createInquiry);

// Admin route to see all inquiries
userinquiryrouter.get("/my-inquiries", authUser, getUserInquiries);



export default userinquiryrouter;
