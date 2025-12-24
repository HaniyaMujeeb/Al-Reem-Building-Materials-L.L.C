import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendURL } from "../App";
import { toast } from "react-toastify";
import { assets } from '../assets/assets';

const AddProductModel = ({ inquiry, token, close, refresh }) => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState("");

    // Fetch all products from backend
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get(`${backendURL}/api/product/list`);
                if (res.data.success) setProducts(res.data.data);
                else toast.error(res.data.message);
            } catch (err) {
                toast.error("Failed to fetch products");
            }
        };
        fetchProducts();
    }, []);

    const addProduct = async () => {
        if (!selectedProduct) return toast.error("Select a product");
        if (selectedProduct.sizes?.length > 0 && !selectedSize) return toast.error("Select a size");

        const productToAdd = {
            productId: selectedProduct._id,
            productName: selectedProduct.name,
            quantity,
            size: selectedSize || null,
            image: selectedProduct.image || "",
        };

        try {
            const res = await axios.post(
                `${backendURL}/api/admin/inquiries/add-product`,
                { inquiryId: inquiry._id, product: productToAdd },
                { headers: { token } }
            );

            if (res.data.success) {
                toast.success("Product added");
                setSelectedProduct(null);
                setSelectedSize("");
                setQuantity(1);
                refresh();
                close();
            } else toast.error(res.data.message);
        } catch {
            toast.error("Failed to add product");
        }
    };

    return (
        <div className="modal">
            <h3>Add Product</h3>

            {/* Product dropdown */}
            <select
                value={selectedProduct?._id || ""}
                onChange={(e) => {
                    const prod = products.find(p => p._id === e.target.value);
                    setSelectedProduct(prod);
                    setSelectedSize(""); // reset size
                }}
            >
                <option value="">Select Product</option>
                {products.map((p) => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                ))}
            </select>

            {/* Quantity input */}
            <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                placeholder="Quantity"
            />

            {/* Size dropdown only if product has sizes */}
            {selectedProduct?.sizes?.length > 0 && (
                <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                >
                    <option value="">Select Size</option>
                    {selectedProduct.sizes.map((s) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
            )}

            {/* Product image */}
            {selectedProduct && (
                <img
                    src={selectedProduct.image || assets.no_image}
                    alt={selectedProduct.name}
                    style={{ width: "80px", marginTop: "5px" }}
                />
            )}

            <div className="modal-actions">
                <button onClick={addProduct}>Add</button>
                <button onClick={close}>Cancel</button>
            </div>
        </div>
    );
};

export default AddProductModel;
