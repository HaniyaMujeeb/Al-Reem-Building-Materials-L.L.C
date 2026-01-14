import { v2 as cloudinary } from "cloudinary";
import productModel from "../Models/ProductModel.js";

// 📌 Add Product Function
const addProduct = async (req, res) => {

    try {
        const { name, description, price, category, subCategory, sizes, bestseller, productCode } = req.body;

        // ✅ Enforce productCode ONLY when adding
        if (!productCode || productCode.trim() === "") {
            return res.json({
                success: false,
                message: "Product code is required"
            });
        }

        // ✅ Check if product code already exists
        const existingCode = await productModel.findOne({ productCode });
        if (existingCode) {
            return res.json({
                success: false,
                message: "Product code already exists"
            });
        }


        let parsedSizes = [];
        let finalPrice = null;

        if (sizes) {
            try {
                parsedSizes = JSON.parse(sizes);
                if (!Array.isArray(parsedSizes)) {
                    throw new Error("Invalid sizes format. Must be an array.");
                }
            } catch (error) {
                return res.json({ success: false, message: "Invalid sizes data format." });
            }
        }
        if (parsedSizes.length > 0) {
            finalPrice = null;
        } else {
            finalPrice = Number(price);
        }

        // ✅ Handle image uploads
        const images = ["image1", "image2", "image3", "image4"]
            .map((key) => req.files?.[key]?.[0])
            .filter((file) => file !== undefined);

        let imagesURL = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: "image" });
                return result.secure_url;
            })
        );
        // ✅ Prepare product data
        const productData = {
            name,
            productCode: productCode.toUpperCase().trim(),
            description,
            category,
            price: finalPrice,
            subCategory,
            bestseller: bestseller === "true",
            sizes: parsedSizes,
            image: imagesURL,
            date: Date.now(),
        };

        // ✅ Save product to the database
        const product = new productModel(productData);
        await product.save();

        res.json({ success: true, message: "Product Added Successfully" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};


// 📌 List All Products
const listProducts = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.json({ success: true, data: products });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// 📌 Remove Product
const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Product Removed Successfully" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// 📌 Get Single Product Details
const singleProduct = async (req, res) => {
    try {
        const productId = req.query.productId; // 👈 FIX HERE

        if (!productId) {
            return res.json({ success: false, message: "Product ID missing" });
        }

        const product = await productModel.findById(productId);

        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }

        res.json({ success: true, product });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};



// Update Product Details
const updateProduct = async (req, res) => {
    try {
        const updated = await productModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json({ success: true, product: updated });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};


export { addProduct, listProducts, removeProduct, singleProduct, updateProduct };
