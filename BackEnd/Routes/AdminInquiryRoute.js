import express from "express";
import {
  replyToInquiry,
  deleteInquiry,
  addProductToInquiry,
  removeProductFromInquiry,
  updateInquiryProductQuantity,
} from "../Controllers/InquiryAdminController.js";
import { getAllInquiries } from "../Controllers/InquiryController.js";
import authUser from "../Middleware/EmployeeAuth.js";


const inquiryRouter = express.Router();

inquiryRouter.use(authUser)

inquiryRouter.get("/", getAllInquiries);
inquiryRouter.post("/reply", replyToInquiry);
inquiryRouter.post("/add-product", addProductToInquiry);
inquiryRouter.post("/remove-product", removeProductFromInquiry);
inquiryRouter.post("/update-quantity", updateInquiryProductQuantity);
inquiryRouter.delete("/:id", deleteInquiry);

export default inquiryRouter;
