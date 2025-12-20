import userModel from "../Models/UserModel.js";
import jwt from "jsonwebtoken";

// Add product to cart
const addToCart = async (req, res) => {
  try {
    const { itemId, size } = req.body;
    const token = req.headers.token;
    if (!token) return res.status(401).json({ success: false, message: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await userModel.findById(userId);
    let cartData = user.cartData || {};

    if (size) {
      if (!cartData[itemId]) cartData[itemId] = {};
      cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
    } else {
      cartData[itemId] = (cartData[itemId] || 0) + 1;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Item added to cart", cartData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update quantity
const updateCart = async (req, res) => {
  try {
    const { itemId, size, quantity } = req.body;
    const token = req.headers.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await userModel.findById(userId);
    let cartData = user.cartData || {};

    if (size) {
      if (!cartData[itemId]) cartData[itemId] = {};
      cartData[itemId][size] = quantity;
    } else {
      cartData[itemId] = quantity;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Cart updated successfully", cartData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user cart
const getUserCart = async (req, res) => {
  try {
    const token = req.headers.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await userModel.findById(userId);
    res.json({ success: true, cartData: user.cartData || {} });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Merge guest cart
const mergeCart = async (req, res) => {
  try {
    const token = req.headers.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { items } = req.body;
    if (!items || !Array.isArray(items)) return res.status(400).json({ success: false, message: "No items to merge" });

    const user = await userModel.findById(userId);
    let cartData = user.cartData || {};

    items.forEach(({ itemId, size, quantity }) => {
      if (size) {
        if (!cartData[itemId]) cartData[itemId] = {};
        cartData[itemId][size] = (cartData[itemId][size] || 0) + quantity;
      } else {
        cartData[itemId] = (cartData[itemId] || 0) + quantity;
      }
    });

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Cart merged successfully", cartData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { addToCart, updateCart, getUserCart, mergeCart };

