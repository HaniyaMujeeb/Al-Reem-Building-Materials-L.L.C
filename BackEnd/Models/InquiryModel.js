import mongoose from "mongoose";

const InquirySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  userPhone: { type: String, required: true },
  userMessage: { type: String, required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      productName: { type: String, required: true },
      quantity: { type: Number, default: 1 },
      size: { type: String },
      image: { type: String },
    },
  ],

  adminReply: {
    message: String,
    repliedAt: Date,
  },

  status: {
    type: String,
    enum: ["pending", "replied"],
    default: "pending",
  },

}, { timestamps: true });

const Inquiry = mongoose.model("Inquiry", InquirySchema);
export default Inquiry;
