import transporter from "../Config/Nodemailer.js";
import orderModel from "../Models/OrderModel.js";
import userModel from "../Models/UserModel.js";
import PDFDocument from "pdfkit";
import counterModel from "../Models/CounterModel.js";
import fs from 'fs';
import path from 'path';
import inlineBase64 from "nodemailer-plugin-inline-base64"
import baseImage64 from "../longbase64.js";


// Generate PDF Invoice
const generateInvoicePDF = (order, user) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40 });
    const buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });


    // Header
    doc
      .image(baseImage64, 50, 45, { width: 80 }) 
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