import Inquiry from "../Models/InquiryModel.js";
import transporter from "../Config/Nodemailer.js";
import baseImage64 from "../longbase64.js";
import { v2 as cloudinary } from "cloudinary";

// Create a new inquiry
const createInquiry = async (req, res) => {
  try {
    const { userName, userEmail, userPhone, message, items: receivedItems } = req.body;

    // 🔐 Validation
    if (!userName || !userEmail || !userPhone || !message) {
      return res.json({ success: false, message: "All fields are required" });
    }

    if (!receivedItems || !Array.isArray(receivedItems) || receivedItems.length === 0) {
      return res.json({ success: false, message: "Items array is required" });
    }

    // ✅ Map items and generate Cloudinary secure URLs
    const items = receivedItems.map(item => {
      // Use item.productImage first, fallback to item.image
      const publicId = item.productImage || item.image;

      const imageUrl = publicId
        ? cloudinary.url(publicId, { secure: true, width: 200, height: 200, crop: "fill" })
        : "https://via.placeholder.com/60?text=No+Image";

      return {
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        size: item.size || null,
        image: imageUrl,
      };
    });

    // 💾 Save inquiry to DB
    const inquiry = new Inquiry({
      userName,
      userEmail,
      userPhone,
      userMessage: message,
      items,
    });
    await inquiry.save();

    // 📎 Logo attachment
    const logoAttachment = {
      filename: "logo.png",
      content: Buffer.from(baseImage64.replace(/^data:image\/\w+;base64,/, ""), "base64"),
      cid: "companylogo",
    };

    // ===================== ADMIN EMAIL =====================
    const adminHTML = `
      <div style="font-family:Arial; max-width:700px; margin:auto; padding:20px; border:1px solid #ddd;">
        <div style="text-align:center;">
          <img src="cid:companylogo" style="height:60px;" />
          <h2>New Product Inquiry</h2>
        </div>

        <p><strong>Customer Name:</strong> ${userName}</p>
        <p><strong>Email:</strong> ${userEmail}</p>
        <p><strong>Phone:</strong> ${userPhone}</p>

        <p><strong>Message:</strong></p>
        <p style="background:#f7f7f7; padding:10px;">${message}</p>

        <h3>Inquiry Products</h3>
        <table width="100%" border="1" cellpadding="10" cellspacing="0" style="border-collapse:collapse;">
          <thead style="background:#f2f2f2;">
            <tr>
              <th align="left">Product</th>
              <th>Image</th>
              <th>Qty</th>
              <th>Size</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(item => `
              <tr>
                <td>${item.productName}</td>
                <td align="center">
                  <img src="${item.image}" width="60" style="border-radius:4px;" alt="${item.productName}" />
                </td>
                <td align="center">${item.quantity}</td>
                <td align="center">${item.size || "N/A"}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <hr />

        <p><strong>Al Reem Building Materials L.L.C</strong></p>
        <p>Sheikh Salem Bin Sultan Road, Al Mamourah, Ras Al Khaimah</p>
        <p>072288872 / +971554312001 / +971556478562</p>

        <div style="text-align:center; font-size:12px; color:#999;">
          &copy; ${new Date().getFullYear()} Al Reem Building Materials L.L.C
        </div>
      </div>
    `;

    // ===================== USER EMAIL =====================
    const userHTML = `
      <div style="font-family:Arial; max-width:700px; margin:auto; padding:20px; border:1px solid #ddd;">
        <div style="text-align:center;">
          <img src="cid:companylogo" style="height:60px;" />
          <h2>Thank You for Your Inquiry</h2>
        </div>

        <p>Dear <strong>${userName}</strong>,</p>

        <p>
          Thank you for contacting <strong>Al Reem Building Materials L.L.C</strong>.
          We have received your inquiry and our team will contact you shortly.
        </p>

        <h3>Your Inquiry Details</h3>
        <table width="100%" border="1" cellpadding="10" cellspacing="0" style="border-collapse:collapse;">
          <thead style="background:#f2f2f2;">
            <tr>
              <th align="left">Product</th>
              <th>Image</th>
              <th>Qty</th>
              <th>Size</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(item => `
              <tr>
                <td>${item.productName}</td>
                <td align="center">
                  <img src="${item.image}" width="60" style="border-radius:4px;" alt="${item.productName}" />
                </td>
                <td align="center">${item.quantity}</td>
                <td align="center">${item.size || "N/A"}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <p style="margin-top:15px;"><strong>Your Message:</strong></p>
        <p style="background:#f7f7f7; padding:10px;">${message}</p>

        <hr />

        <p><strong>Contact Information</strong></p>
        <p>📍 Sheikh Salem Bin Sultan Road, Al Mamourah, Ras Al Khaimah</p>
        <p>📞 072288872 / +971554312001 / +971556478562</p>
        <p>🕒 Saturday – Thursday | 8:00 AM – 12:00 PM & 3:00 PM – 9:00 PM</p>

        <p>
          Follow us:
          <a href="https://www.instagram.com/alreembuilding/">Instagram</a> |
          <a href="https://www.tiktok.com/@al.reem.buidling">TikTok</a>
        </p>

        <div style="text-align:center; font-size:12px; color:#999;">
          &copy; ${new Date().getFullYear()} Al Reem Building Materials L.L.C. All rights reserved.
        </div>
      </div>
    `;

    // 📧 Send admin email
    await transporter.sendMail({
      from: `"Al Reem Building Materials" <${process.env.SENDER_EMAIL}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New Inquiry – ${userName}`,
      html: adminHTML,
      attachments: [logoAttachment],
    });

    // 📧 Send user email
    await transporter.sendMail({
      from: `"Al Reem Building Materials" <${process.env.SENDER_EMAIL}>`,
      to: userEmail,
      subject: "We Have Received Your Inquiry",
      html: userHTML,
      attachments: [logoAttachment],
    });

    res.json({ success: true, message: "Inquiry submitted successfully" });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Get all inquiries
const getAllInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json({ success: true, data: inquiries });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export { createInquiry, getAllInquiries };
