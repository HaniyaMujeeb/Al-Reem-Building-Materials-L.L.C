import transporter from "../Config/Nodemailer.js";
import orderModel from "../Models/OrderModel.js";
import userModel from "../Models/UserModel.js";
import PDFDocument from "pdfkit";
import counterModel from "../Models/CounterModel.js";
import fs from 'fs';
import path from 'path';
import inlineBase64 from "nodemailer-plugin-inline-base64"


// Generate PDF Invoice
const generateInvoicePDF = (order, user) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40 });
    const buffers = [];

    const base64Image = 'data:image/png;base64,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';


    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });


    // Header
    doc
      .image(base64Image, 50, 45, { width: 80 }) 
      .fontSize(20)
      .text("Al Reem Building Materials L.L.C", 150, 50)
      .fontSize(10)
      .text("Store Location: Sheikh Salem Bin Sultan Road, Al Mamourah, Ras Al Khaimah", 150, 75)
      .text("Contact: +971-556795888", 150, 90)
      .moveDown();

    doc
      .fontSize(16)
      .text("Online Order Invoice", { align: "center" })
      .moveDown();


    // User Info
    doc
      .fontSize(12)
      .text(`Customer: ${user.name}`)
      .text(`Email: ${user.email}`)
      .text(`Order ID: ${order.orderNumber}`)
      .text(`Order Date: ${new Date(order.date).toLocaleString()}`)
      .text(`Payment Method: ${order.paymentMethod}`)
      .moveDown();


    // Delivery Address
    doc
      .fontSize(12)
      .text("Delivery Address:", { underline: true })
      .moveDown(0.5)
      .fontSize(10);

    const fullAddress = [
      order.address.street,
      order.address.city,
      order.address.state,
      order.address.zipcode,
      order.address.country,
      `Phone: ${order.address.phoneNumber}`
    ]
      .filter(Boolean)
      .join(", ");

    doc.text(fullAddress).moveDown();


    // Table Headers
    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .text("Product", 50, doc.y)
      .text("Size", 200, doc.y)
      .text("Qty", 270, doc.y)
      .text("Price", 330, doc.y)
      .text("Subtotal", 400, doc.y);

    // Horizontal line under headers
    doc
      .moveTo(50, doc.y + 5)
      .lineTo(550, doc.y + 5)
      .stroke();

    doc.moveDown(0.5);
    doc.font("Helvetica").fontSize(10);


    // Table Body
    let subtotal = 0;
    order.items.forEach((item) => {
      const itemSubtotal = item.quantity * item.price;
      subtotal += itemSubtotal;

      doc
        .text(item.name, 50, doc.y)
        .text(item.size || 'N/A', 200, doc.y)
        .text(item.quantity.toString(), 270, doc.y)
        .text(`AED ${item.price.toFixed(2)}`, 330, doc.y)
        .text(`AED ${itemSubtotal.toFixed(2)}`, 400, doc.y);

      // Line after each product row
      doc
        .moveTo(50, doc.y + 15)
        .lineTo(550, doc.y + 15)
        .stroke();

      doc.moveDown(1);
    });

    const vat_rate = parseFloat((order.vat_rate) || 0);
    const shipping_fee = parseFloat(order.shipping_fee || 0);
    const total = (subtotal + vat_rate + shipping_fee).toFixed(2);

    // Totals section
    doc
      .moveDown()
      .fontSize(12)
      .text(`Subtotal: AED ${subtotal.toFixed(2)}`, { align: "right" })
      .text(`VAT (5%): AED ${vat_rate.toFixed(2)}`, { align: "right" })
      .text(`Shipping Fee: AED ${shipping_fee.toFixed(2)}`, { align: "right" })
      .moveDown()
      .font("Helvetica-Bold")
      .fontSize(14)
      .text(`Total: AED ${total}`, { align: "right" });

    doc.end();
  });
};



// Placing Orders using Cash On Delivery Method
const placeOrder = async (req, res) => {
  try {
    const { userId, items, address, vat_rate = 5, shipping_fee = 5 } = req.body;

    // 🔢 Calculate subtotal from items
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const vatAmount = +(subtotal * (vat_rate / 100)).toFixed(2);
    const totalAmount = +(subtotal + vatAmount + shipping_fee).toFixed(2);

    // 🔢 Get the next order number
    const counter = await counterModel.findOneAndUpdate(
      { id: "orderNumber" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    const orderNumber = String(counter.seq).padStart(7, "0");

    const orderData = {
      userId,
      address,
      items,
      amount: totalAmount,
      vat_rate: vatAmount,
      shipping_fee,
      paymentMethod: 'Cash On Delivery',
      payment: false,
      date: Date.now(),
      orderNumber,
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // Clear cart
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    const user = await userModel.findById(userId);
    const pdfBuffer = await generateInvoicePDF(newOrder, user);

    // ✅ Update HTML email section:
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: `Order Confirmation ${newOrder.orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: auto; padding: 20px; border: 1px solid #ddd;">
          <h2 style="text-align: center;">🧾 Order Confirmation</h2>
          <p>Dear ${user.name},</p>
          <p>Thank you for shopping with us! Here are your order details:</p>

          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background-color: #f8f8f8;">
                <th style="padding: 10px; border: 1px solid #ccc;">Product</th>
                <th style="padding: 10px; border: 1px solid #ccc;">Image</th>
                <th style="padding: 10px; border: 1px solid #ccc;">Qty</th>
                <th style="padding: 10px; border: 1px solid #ccc;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => `
                <tr>
                  <td style="padding: 10px; border: 1px solid #ccc;">${item.name}<br /><small>Size: ${item.size || 'N/A'}</small></td>
                  <td style="padding: 10px; border: 1px solid #ccc;">
                    <img src="${item.image}" width="60" style="border-radius: 4px;" />
                  </td>
                  <td style="padding: 10px; border: 1px solid #ccc; text-align: center;">${item.quantity}</td>
                  <td style="padding: 10px; border: 1px solid #ccc;">AED ${item.price}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <p><strong>Subtotal:</strong> AED ${subtotal.toFixed(2)}</p>
          <p><strong>VAT (5%):</strong> AED ${vatAmount.toFixed(2)}</p>
          <p><strong>Delivery Fee:</strong> AED ${shipping_fee.toFixed(2)}</p>
          <p><strong>Total Amount:</strong> AED ${totalAmount.toFixed(2)}</p>
          <p><strong>Order ID:</strong> ${orderData.orderNumber}</p>
          <p><strong>Order Date:</strong> ${new Date(orderData.date).toLocaleString()}</p>

          <p style="margin-top: 20px;">We appreciate your business. If you have any questions, feel free to reply to this email.</p>
        </div>
      `,
      attachments: [
        {
          filename: `Invoice-${newOrder.orderNumber}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        }
      ]
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Order Placed" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};



// Placing Orders using Card Payment Method
const placeOrderCard = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    const orderData = {
      userId,
      address,
      items,
      amount,
      paymentMethod: 'Card Payment',
      payment: true, // ✅ Should be true since card payment is assumed successful
      date: Date.now(),
    };

    // Save the order
    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // Clear the user's cart after placing the order
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order placed successfully via card payment." });

  } catch (error) {
    console.error("Error in placeOrderCard:", error);
    res.status(500).json({ success: false, message: "Failed to place order: " + error.message });
  }
};


// All Orders for Admin Panel
const allOrders = async (req, res) => {
  try {

    const orders = await orderModel.find({})
    res.json({ success: true, orders })

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message })
  }
}

// User Orders Data for Frontend
const userOrders = async (req, res) => {
  try {

    const { userId } = req.body

    const orders = await orderModel.find({ userId })
    res.json({ success: true, orders })

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message })
  }
}

// Update Order Status From Admin Panel
const updateStatus = async (req, res) => {
  try {
    const { orderId, status, paymentDone } = req.body;

    const updateData = { status };

    // If admin indicates payment is done (for COD), update payment status
    if (paymentDone) {
      updateData.payment = true;
    }

    await orderModel.findByIdAndUpdate(orderId, updateData);

    res.json({ success: true, message: "Order Status Updated" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


export { placeOrder, placeOrderCard, allOrders, userOrders, updateStatus } 