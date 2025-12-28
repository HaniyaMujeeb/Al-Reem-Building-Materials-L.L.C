import express from "express";
import { createInquiry, getAllInquiries, getUserInquiries } from "../Controllers/InquiryController.js";
import adminAuth from '../Middleware/AdminAuth.js'
import authUser from '../Middleware/Auth.js'

const router = express.Router();

// Public route for submitting inquiry
router.post("/create", authUser, createInquiry);

// Admin route to see all inquiries
router.get("/", adminAuth, getAllInquiries);
router.get("/my-inquiries", authUser, getUserInquiries);



export default router;
