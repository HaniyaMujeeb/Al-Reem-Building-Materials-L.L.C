import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    image: { type: Array, required: true },
    bestseller: { type: Boolean },
    date: { type: Number, required: true },

    // If product has only one price (no sizes)
    price: { type: Number, required: function() { return this.sizes.length === 0 } },

    // If product has multiple sizes with different prices
    sizes: [
        {
            size: { type: String },
            price: { type: Number }
        }
    ]
});

const productModel = mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;










