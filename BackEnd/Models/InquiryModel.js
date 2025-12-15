import mongoose from "mongoose";

const InquirySchema = new mongoose.Schema({
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      productName: { type: String, required: true },
      quantity: { type: Number, default: 1 },
    },
  ],
}, { timestamps: true });

const Inquiry = mongoose.model("Inquiry", InquirySchema);
export default Inquiry;
