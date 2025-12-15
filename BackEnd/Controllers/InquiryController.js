import Inquiry from "../Models/InquiryModel.js";
import transporter from "../Config/Nodemailer.js";

// Create a new inquiry
export const createInquiry = async (req, res) => {
  try {
    const { userName, userEmail, items } = req.body;

    // Save inquiry to database
    const inquiry = new Inquiry({ userName, userEmail, items });
    await inquiry.save();

    // Send email to admin
    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: `New Product Inquiry from ${userName}`,
      html: `
        <h3>New Inquiry</h3>
        <p>Name: ${userName}</p>
        <p>Email: ${userEmail}</p>
        <h4>Products:</h4>
        <ul>
          ${items.map(i => `<li>${i.productName} (Qty: ${i.quantity})</li>`).join("")}
        </ul>
      `,
    });

    // Send confirmation email to user
    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: userEmail,
      subject: "Your Inquiry has been received",
      html: `<p>Hi ${userName},</p><p>We have received your inquiry. Our team will contact you soon.</p>`,
    });

    res.status(201).json({ message: "Inquiry submitted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Admin: Get all inquiries
export const getAllInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.status(200).json(inquiries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
