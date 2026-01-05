import Inquiry from "../Models/InquiryModel.js";
import transporter from "../Config/Nodemailer.js";
import baseImage64 from "../longbase64.js";
import AuditLog from "../Models/AuditLogModel.js";


/* =========================================================
   📌 REPLY TO INQUIRY (SAVE + SEND EMAIL)
========================================================= */
export const replyToInquiry = async (req, res) => {
  try {
    const { inquiryId, replyMessage, repliedBy } = req.body;
    const employeeId = req.user?.id;

    if (!inquiryId || !replyMessage)
      return res.status(400).json({ success: false, message: "Missing data" });

    const inquiry = await Inquiry.findById(inquiryId);
    if (!inquiry)
      return res.status(404).json({ success: false, message: "Inquiry not found" });

    // Make sure inquiry.userId exists
    if (!inquiry.userId) {
      return res.status(400).json({ success: false, message: "Inquiry missing userId" });
    }


    // Save reply
    inquiry.adminReply = {
      message: replyMessage,
      repliedAt: new Date(),
      repliedBy: req.user.name,
    };
    inquiry.status = "replied";
    inquiry.lastModifiedBy = employeeId;

    await inquiry.save();

    await AuditLog.create({
      action: "REPLY_INQUIRY",
      performedBy: employeeId,
      details: `Replied to inquiry from ${inquiry.userEmail}`,
    });



    // Logo attachment
    const logoAttachment = {
      filename: "logo.png",
      content: Buffer.from(
        baseImage64.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      ),
      cid: "companylogo",
    };

    // Email HTML
    const replyHTML = `
      <div style="font-family:Arial; max-width:700px; margin:auto; padding:20px; border:1px solid #ddd;">
        <div style="text-align:center;">
          <img src="cid:companylogo" style="height:60px;" />
          <h2>Replied to Your Inquiry</h2>
        </div>

        <p>Dear <strong>${inquiry.userName}</strong>,</p>

        <p>${replyMessage}</p>

        <p style="margin-top:10px;">
          <strong>${repliedBy}</strong> 
        </p>

        <hr />

        <p><strong>Al Reem Building Materials L.L.C</strong></p>
        <p>Sheikh Salem Bin Sultan Road, Al Mamourah, Ras Al Khaimah</p>
        <p>📞 072288872 / +971554312001 / +971556478562</p>

        <div style="text-align:center; font-size:12px; color:#999;">
          &copy; ${new Date().getFullYear()} Al Reem Building Materials L.L.C
        </div>
      </div>
    `;

    // Send email to customer
    await transporter.sendMail({
      from: `"Al Reem Building Materials" <${process.env.SENDER_EMAIL}>`,
      to: inquiry.userEmail,
      subject: "Replied to Your Inquiry",
      html: replyHTML,
      attachments: [logoAttachment],
    });

    res.json({
      success: true,
      message: "Reply sent and saved successfully",
    });

  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================================
   🗑 DELETE INQUIRY
========================================================= */
export const deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) return res.status(404).json({ success: false, message: "Inquiry not found" });

    // Create audit log
    await AuditLog.create({
      action: "DELETE_INQUIRY",
      performedBy: req.user.id, // assuming your auth middleware sets req.user
      targetInquiryId: inquiry._id,
      details: `Inquiry from "${inquiry.userName}" was deleted`,
    });

    res.json({ success: true, message: "Inquiry deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



/* =========================================================
   ➕ ADD PRODUCT TO EXISTING INQUIRY + EMAIL
========================================================= */
export const addProductToInquiry = async (req, res) => {
  try {
    const { inquiryId, product } = req.body;
    const employeeId = req.user?.id;

    if (!inquiryId || !product) {
      return res.json({
        success: false,
        message: "Inquiry ID and product data are required",
      });
    }

    const inquiry = await Inquiry.findById(inquiryId);
    if (!inquiry) {
      return res.json({ success: false, message: "Inquiry not found" });
    }

    inquiry.items.push({
      productId: product.productId,
      productName: product.productName,
      quantity: product.quantity || 1,
      size: product.size || null,
      image: product.image || "",
    });

    inquiry.lastModifiedBy = employeeId;
    await inquiry.save();

    await AuditLog.create({
      action: "ADD_INQUIRY_PRODUCT",
      performedBy: employeeId,
      details: `Added product "${product.productName}" to inquiry (${inquiry.userEmail})`,
    });


    /* ---------- EMAIL ---------- */
    const logoAttachment = {
      filename: "logo.png",
      content: Buffer.from(
        baseImage64.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      ),
      cid: "companylogo",
    };

    const productImageHTML = product.image
      ? `<img src="${product.image}" style="max-width:180px;margin-top:10px;border-radius:6px;" />`
      : "";

    const emailHTML = `
      <div style="font-family:Arial; max-width:700px; margin:auto; padding:20px; border:1px solid #ddd;">
        <div style="text-align:center;">
          <img src="cid:companylogo" style="height:60px;" />
          <h2>New Product Added to Your Inquiry</h2>
        </div>

        <p>Dear <strong>${inquiry.userName}</strong>,</p>

        <p>
          A new product has been added to your inquiry:
        </p>

        <p>
          <strong>${product.productName}</strong><br/>
          Quantity: ${product.quantity}<br/>
          Size: ${product.size || "N/A"}
        </p>

        ${productImageHTML}

        <p style="margin-top:15px; color:red;">
          If this was done by mistake, please contact us immediately.
        </p>

        <hr />

        <p><strong>Al Reem Building Materials L.L.C</strong></p>
        <p>📞 072288872 / +971554312001 / +971556478562</p>

        <div style="text-align:center; font-size:12px; color:#999;">
          &copy; ${new Date().getFullYear()} Al Reem Building Materials L.L.C
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"Al Reem Building Materials" <${process.env.SENDER_EMAIL}>`,
      to: inquiry.userEmail,
      subject: "New Product Added to Your Inquiry",
      html: emailHTML,
      attachments: [logoAttachment],
    });

    res.json({
      success: true,
      message: "Product added and email sent",
    });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};



/* =========================================================
   ❌ REMOVE PRODUCT FROM INQUIRY + EMAIL
========================================================= */
export const removeProductFromInquiry = async (req, res) => {
  try {
    const { inquiryId, itemId } = req.body;
    const employeeId = req.user?.id;

    if (!inquiryId || !itemId) {
      return res.json({ success: false, message: "Missing data" });
    }

    const inquiry = await Inquiry.findById(inquiryId);
    if (!inquiry) {
      return res.json({ success: false, message: "Inquiry not found" });
    }

    const removedItem = inquiry.items.id(itemId);
    if (!removedItem) {
      return res.json({ success: false, message: "Product not found" });
    }

    inquiry.items.pull(itemId);
    inquiry.lastModifiedBy = employeeId;
    await inquiry.save();

    await AuditLog.create({
      action: "REMOVE_INQUIRY_PRODUCT",
      performedBy: employeeId,
      details: `Removed product "${removedItem.productName}" from inquiry (${inquiry.userEmail})`,
    });


    /* ---------- EMAIL ---------- */
    const logoAttachment = {
      filename: "logo.png",
      content: Buffer.from(
        baseImage64.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      ),
      cid: "companylogo",
    };

    const productImageHTML = removedItem.image
      ? `<img src="${removedItem.image}" style="max-width:180px;margin-top:10px;border-radius:6px;" />`
      : "";

    const emailHTML = `
      <div style="font-family:Arial; max-width:700px; margin:auto; padding:20px; border:1px solid #ddd;">
        <div style="text-align:center;">
          <img src="cid:companylogo" style="height:60px;" />
          <h2>Product Removed From Your Inquiry</h2>
        </div>

        <p>Dear <strong>${inquiry.userName}</strong>,</p>

        <p>
          The following product has been removed from your inquiry:
        </p>

        <p><strong>${removedItem.productName}</strong></p>

        ${productImageHTML}

        <p style="margin-top:15px; color:red;">
          If this was done by mistake, please contact us immediately.
        </p>

        <hr />

        <p><strong>Al Reem Building Materials L.L.C</strong></p>
        <p>📞 072288872 / +971554312001 / +971556478562</p>

        <div style="text-align:center; font-size:12px; color:#999;">
          &copy; ${new Date().getFullYear()} Al Reem Building Materials L.L.C
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"Al Reem Building Materials" <${process.env.SENDER_EMAIL}>`,
      to: inquiry.userEmail,
      subject: "Product Removed From Your Inquiry",
      html: emailHTML,
      attachments: [logoAttachment],
    });

    res.json({
      success: true,
      message: "Product removed and email sent",
    });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};



export const updateInquiryProductQuantity = async (req, res) => {
  try {
    const { inquiryId, itemId, quantity } = req.body;
    const employeeId = req.user?.id;
    if (!inquiryId || !itemId || quantity < 1) {
      return res.json({ success: false, message: "Invalid data" });
    }

    const inquiry = await Inquiry.findById(inquiryId);
    if (!inquiry) return res.json({ success: false, message: "Inquiry not found" });

    const item = inquiry.items.id(itemId);
    if (!item) return res.json({ success: false, message: "Product not found" });

    item.quantity = quantity;
    inquiry.lastModifiedBy = employeeId;
    await inquiry.save();

    await AuditLog.create({
      action: "UPDATE_INQUIRY_PRODUCT_QTY",
      performedBy: employeeId,
      details: `Updated quantity for "${item.productName}" to ${quantity} (Inquiry: ${inquiry.userEmail})`,
    });


    res.json({ success: true, message: "Quantity updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

