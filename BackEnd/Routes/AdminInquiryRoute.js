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


const admininquiryRouter = express.Router();

admininquiryRouter.get("/", adminAuth, getAllInquiries);
admininquiryRouter.post("/reply", adminAuth, replyToInquiry);
admininquiryRouter.delete("/:id", adminAuth, deleteInquiry);
admininquiryRouter.post("/add-product", adminAuth, addProductToInquiry);
admininquiryRouter.post("/remove-product", adminAuth, removeProductFromInquiry);
admininquiryRouter.post("/update-quantity", adminAuth, updateInquiryProductQuantity);



export default admininquiryRouter;
