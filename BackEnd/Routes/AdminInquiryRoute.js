import express from "express";
import adminAuth from "../Middleware/AdminAuth.js";
import {
  replyToInquiry,
  deleteInquiry,
  addProductToInquiry,
  removeProductFromInquiry,
  updateInquiryProductQuantity,
} from "../Controllers/InquiryAdminController.js";
import { getAllInquiries } from "../Controllers/InquiryController.js";
import Inquiry from "../Models/InquiryModel.js";

const admininquiryRouter = express.Router();

// Get all inquiries
admininquiryRouter.get("/", adminAuth, getAllInquiries);

// Admin actions
admininquiryRouter.post("/reply", adminAuth, replyToInquiry);
admininquiryRouter.delete("/:id", adminAuth, deleteInquiry);
admininquiryRouter.post("/add-product", adminAuth, addProductToInquiry);
admininquiryRouter.post("/remove-product", adminAuth, removeProductFromInquiry);
admininquiryRouter.post("/update-quantity", adminAuth, updateInquiryProductQuantity);

// GET /api/admin/inquiries/stats
admininquiryRouter.get('/stats', adminAuth, async (req, res) => {
  try {
    const totalReplied = await Inquiry.countDocuments({ status: "replied" });
    const totalPending = await Inquiry.countDocuments({ status: "pending" });

    res.json({
      success: true,
      replied: totalReplied,
      pending: totalPending
    });
  } catch (err) {
    console.error("Error fetching inquiry stats:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Temporary debug route to inspect all inquiries
admininquiryRouter.get('/debug', adminAuth, async (req, res) => {
  try {
    const all = await Inquiry.find({});
    res.json({ success: true, inquiries: all.map(i => ({ id: i._id, status: i.status })) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default admininquiryRouter;

