import userModel from "../Models/UserModel.js";
import jwt from "jsonwebtoken";

// Add Products to User Cart
const addToCart = async (req, res) => {
    try {
        const { itemId, size } = req.body;
        const token = req.headers.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const user = await userModel.findById(userId);
        let cartData = user.cartData || {};

        if (size) {
            // Product with size
            if (!cartData[itemId]) {
                cartData[itemId] = {};
            }

            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            } else {
                cartData[itemId][size] = 1;
            }
        } else {
            // Product without size
            if (typeof cartData[itemId] === "number") {
                cartData[itemId] += 1;
            } else {
                cartData[itemId] = 1;
            }
        }
        
        // Update the cartData in the user model
        await userModel.findByIdAndUpdate(userId, { cartData });

        res.json({ success: true, message: "Item added to cart" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};




// Update Products in the Users Cart
const updateCart = async (req, res) => {
    try {

        const { userId, itemId, size, quantity } = req.body;

        const userData = await userModel.findById(userId);
        let cartData = await userData.cartData;

        cartData[itemId][size] = quantity

        await userModel.findByIdAndUpdate(userId, { cartData })
        res.json({ success: true, message: "Cart updated successfully" })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message  })
        
    }
} 


// Get data from  User Cart
const getUserCart = async (req, res) => {

   try {
    
    const {userId} = req.body

    const userData = await userModel.findById(userId)
    let cartData = await userData.cartData;

    res.json({success: true, cartData})

   } catch (error) {
    console.log(error);
    res.json({success: false, message: error.message}) 
    
   }

}


export { addToCart, updateCart, getUserCart }