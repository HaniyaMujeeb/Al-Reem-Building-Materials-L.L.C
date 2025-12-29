import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendURL } from "../App";
import { toast } from "react-toastify";
import { assets } from '../assets/assets';

const AddProductModel = ({ inquiry, token, close, refresh, employeeName }) => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState("");
    const [search, setSearch] = useState("");

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
            addedBy: employeeName || "Unknown", // Store employee who added
        };

        try {
            const res = await axios.post(
                `${backendURL}/api/admin/inquiries/add-product`,
                { inquiryId: inquiry._id, product: productToAdd },
                { headers: { token } }
            );

            if (res.data.success) {
                toast.success(`Product added by ${employeeName}`);
                setSelectedProduct(null);
                setSelectedSize("");
                setQuantity(1);
                setSearch(""); // reset search
                refresh();
                close();
            } else toast.error(res.data.message);
        } catch {
            toast.error("Failed to add product");
        }
    };

    // Filter products based on search
    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="modal">
            <h3>Add Product</h3>

            {/* Search input */}
            <input
                type="text"
                placeholder="Search product..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: "100%", marginBottom: "8px", padding: "6px" }}
            />

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
                {filteredProducts.map((p) => (
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
                <button onClick={addProduct}>Add Product</button>
                <button onClick={close}>Cancel</button>
            </div>
        </div>
    );
};

export default AddProductModel;
