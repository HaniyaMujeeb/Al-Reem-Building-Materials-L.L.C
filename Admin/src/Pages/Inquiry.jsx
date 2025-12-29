import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendURL } from "../App";
import { toast } from "react-toastify";
import { assets } from '../assets/assets';

const Inquiries = ({ token }) => {
    const [inquiries, setInquiries] = useState([]);
    const [search, setSearch] = useState("");

    // Reply states
    const [replyingInquiryId, setReplyingInquiryId] = useState(null);
    const [replyMessage, setReplyMessage] = useState("");
    const [repliedBy, setRepliedBy] = useState("");

    // Add Product states
    const [addingProductInquiryId, setAddingProductInquiryId] = useState(null);
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [loadingProducts, setLoadingProducts] = useState(true);

    // Loader state
    const [loading, setLoading] = useState(false);

    // ✅ Static employee list (can be dynamic later)
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const res = await axios.get(
                    `${backendURL}/api/admin/employees`,
                    { headers: { token } }
                );
                if (res.data.success) {
                    setEmployees(res.data.data);
                }
            } catch {
                toast.error("Failed to load employees");
            }
        };

        fetchEmployees();
    }, []);



    // Fetch inquiries
    const fetchInquiries = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${backendURL}/api/admin/inquiries`, {
                headers: { token },
            });
            if (res.data.success) {

                setInquiries(res.data.data);
            } else toast.error(res.data.message);
        } catch (err) {
            toast.error("Failed to fetch inquiries");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInquiries();
    }, []);

    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            setLoadingProducts(true);
            setLoading(true);
            try {
                const res = await axios.get(`${backendURL}/api/product/list`);
                if (res.data.success && Array.isArray(res.data.data)) {
                    setProducts(res.data.data);
                } else {
                    setProducts([]);
                    toast.error(res.data.message || "No products found");
                }
            } catch (err) {
                setProducts([]);
                toast.error("Failed to fetch products");
            } finally {
                setLoadingProducts(false);
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Delete inquiry
    const deleteInquiry = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        setLoading(true);
        try {
            const res = await axios.delete(
                `${backendURL}/api/admin/inquiries/${id}`,
                { headers: { token } }
            );
            if (res.data.success) {
                toast.success("Inquiry deleted");
                fetchInquiries();
            } else toast.error(res.data.message);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Send reply
    const sendReply = async (inquiryId) => {
        if (!repliedBy) return toast.error("Select employee name");
        if (!replyMessage.trim()) return toast.error("Reply cannot be empty");

        setLoading(true);
        try {
            const res = await axios.post(
                `${backendURL}/api/admin/inquiries/reply`,
                { inquiryId, replyMessage, repliedBy }, // ✅ added
                { headers: { token } }
            );

            if (res.data.success) {
                toast.success("Reply sent");
                setReplyingInquiryId(null);
                setReplyMessage("");
                setRepliedBy("");
                fetchInquiries();
            } else toast.error(res.data.message);
        } catch {
            toast.error("Failed to send reply");
        } finally {
            setLoading(false);
        }
    };

    // Add product to inquiry
    const handleAddProduct = async (inquiryId) => {
        if (!selectedProduct) return toast.error("Select a product");
        if (selectedProduct.sizes?.length > 0 && !selectedSize) return toast.error("Select a size");

        const productToAdd = {
            productId: selectedProduct._id,
            productName: selectedProduct.name,
            quantity,
            size: selectedSize || null,
            image: Array.isArray(selectedProduct.image) ? selectedProduct.image[0] : selectedProduct.image || "",
        };

        setLoading(true);
        try {
            const res = await axios.post(
                `${backendURL}/api/admin/inquiries/add-product`,
                { inquiryId, product: productToAdd },
                { headers: { token } }
            );
            if (res.data.success) {
                toast.success("Product added");
                setAddingProductInquiryId(null);
                setSelectedProduct(null);
                setSelectedSize("");
                setQuantity(1);
                fetchInquiries();
            } else toast.error(res.data.message);
        } catch {
            toast.error("Failed to add product");
        } finally {
            setLoading(false);
        }
    };

    // Remove product from inquiry
    const handleRemoveProduct = async (inquiryId, itemId) => {
        if (!window.confirm("Remove this product from inquiry?")) return;
        setLoading(true);
        try {
            const res = await axios.post(
                `${backendURL}/api/admin/inquiries/remove-product`,
                { inquiryId, itemId },
                { headers: { token } }
            );

            if (res.data.success) {
                toast.success("Product removed");
                fetchInquiries();
            } else {
                toast.error(res.data.message);
            }
        } catch {
            toast.error("Failed to remove product");
        } finally {
            setLoading(false);
        }
    };

    // Update product quantity
    const updateQuantity = async (inquiryId, itemId, newQty) => {
        if (newQty < 1) return;
        setLoading(true);
        try {
            const res = await axios.post(
                `${backendURL}/api/admin/inquiries/update-quantity`,
                { inquiryId, itemId, quantity: newQty },
                { headers: { token } }
            );

            if (res.data.success) {
                toast.success("Quantity updated");
                fetchInquiries();
            } else {
                toast.error(res.data.message);
            }
        } catch {
            toast.error("Failed to update quantity");
        } finally {
            setLoading(false);
        }
    };

    const filteredInquiries = inquiries.filter(
        (i) =>
            i.userName.toLowerCase().includes(search.toLowerCase()) ||
            i.userEmail.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="inquiries-page">
            {/* Loader */}
            {loading && (
                <div className="loader-overlay">
                    <div className="loader"></div>
                </div>
            )}

            <h2>All Inquiries:</h2>
            <input
                type="text"
                placeholder="Search by name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
            />

            <div className="inquiry-list">
                {filteredInquiries.length === 0 && <p>No inquiries found</p>}

                {filteredInquiries.map((inq) => (
                    <div key={inq._id} className="inquiry-card">
                        <div className="inquiry-header">
                            <div>
                                <h4>Name: {inq.userName}</h4>
                                <p className="inquiry-id">ID: {inq._id.slice(-6)}</p>
                            </div>
                            <span className={`badge-inquiry ${inq.status}`}>{inq.status}</span>
                        </div>

                        {inq.status === "replied" && inq.adminReply?.repliedBy && (
                            <p className="employee-reply">
                                <strong>Replied by:</strong> {inq.adminReply.repliedBy}
                            </p>
                        )}


                        <p><strong>Email:</strong> {inq.userEmail}</p>
                        <p><strong>Phone:</strong> {inq.userPhone}</p>
                        <p><strong>Message:</strong> {inq.userMessage}</p>

                        <div className="inquiry-products">
                            {inq.items.map((item) => (
                                <div key={item._id} className="product-item">
                                    <img
                                        src={item.image || assets.no_image}
                                        alt={item.productName}
                                        onError={(e) => (e.target.src = assets.no_image)}
                                    />
                                    <p>{item.productName}</p>

                                    <div className="qty-control">
                                        <button
                                            onClick={() => updateQuantity(inq._id, item._id, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                        >
                                            −
                                        </button>

                                        <span>{item.quantity}</span>

                                        <button
                                            onClick={() => updateQuantity(inq._id, item._id, item.quantity + 1)}
                                        >
                                            +
                                        </button>
                                    </div>

                                    <p>Size: {item.size || "N/A"}</p>

                                    <button
                                        className="remove-product-btn"
                                        onClick={() => handleRemoveProduct(inq._id, item._id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="actions">
                            <button
                                onClick={() =>
                                    setReplyingInquiryId(
                                        replyingInquiryId === inq._id ? null : inq._id
                                    )
                                }
                            >
                                {replyingInquiryId === inq._id ? "Cancel" : "Reply"}
                            </button>
                            <button onClick={() => deleteInquiry(inq._id)}>Delete</button>
                            <button
                                onClick={() =>
                                    setAddingProductInquiryId(
                                        addingProductInquiryId === inq._id ? null : inq._id
                                    )
                                }
                            >
                                {addingProductInquiryId === inq._id ? "Cancel" : "Add Product"}
                            </button>
                        </div>

                        {/* Inline Reply Box */}
                        {replyingInquiryId === inq._id && (
                            <div className="reply-box">
                                {/* Employee dropdown */}
                                <select
                                    value={repliedBy}
                                    onChange={(e) => {
                                        const selectedEmployee = e.target.value;
                                        setRepliedBy(selectedEmployee);

                                        // Optional: Auto-fill initial message when employee selected
                                        if (selectedEmployee && !replyMessage.trim()) {
                                            const currentInquiry = inquiries.find(i => i._id === replyingInquiryId);
                                            const initialMessage = `Hi, This is ${selectedEmployee} from our sales team regarding your inquiry about "${currentInquiry.items.map(item => item.productName).join(", ")}".\n\n`;
                                            setReplyMessage(initialMessage);
                                        }
                                    }}
                                >
                                    <option value="">Select Employee</option>
                                    {employees.map((emp) => (
                                        <option key={emp._id} value={emp.name}>
                                            {emp.name}
                                        </option>
                                    ))}
                                </select>

                                {/* Reply textarea */}
                                <textarea
                                    rows="6"
                                    placeholder="Type your reply..."
                                    value={replyMessage}
                                    onChange={(e) => setReplyMessage(e.target.value)}
                                />

                                {/* Send button */}
                                <button
                                    onClick={async () => {
                                        if (!repliedBy) return toast.error("Select Employee Name");
                                        if (!replyMessage.trim()) return toast.error("Reply cannot be empty");

                                        setLoading(true);
                                        try {
                                            // Footer appended automatically
                                            const footer = `
<br><br>---
<br>If you would like to purchase this product, please contact us on WhatsApp - +971556478562,
<br>call us on this number - 072288872, or reply back to this email to confirm your order.
<br>If you would like to pay by card, please visit our store.
<br>If you prefer Cash on Delivery, please send us your address along with the reply and confirm your payment method.
`;

                                            const fullMessage = replyMessage + footer;

                                            const res = await axios.post(
                                                `${backendURL}/api/admin/inquiries/reply`,
                                                { inquiryId: inq._id, replyMessage: fullMessage, repliedBy },
                                                { headers: { token } }
                                            );

                                            if (res.data.success) {
                                                toast.success("Reply sent");
                                                setReplyingInquiryId(null);
                                                setReplyMessage("");
                                                setRepliedBy("");
                                                fetchInquiries();
                                            } else toast.error(res.data.message);
                                        } catch {
                                            toast.error("Failed to send reply");
                                        } finally {
                                            setLoading(false);
                                        }
                                    }}
                                >
                                    Send Reply
                                </button>
                            </div>
                        )}


                        {/* Inline Add Product Box */}
                        {addingProductInquiryId === inq._id && (
                            <div className="add-product-box">
                                {/* Product dropdown */}
                                <select
                                    disabled={loadingProducts || !products?.length}
                                    value={selectedProduct?._id || ""}
                                    onChange={(e) => {
                                        const prod = products.find((p) => p._id === e.target.value);
                                        setSelectedProduct(prod);
                                        setSelectedSize(""); // reset size
                                    }}
                                >
                                    <option value="">Select Product</option>
                                    {products && products.length > 0 ? (
                                        products.map((p) => (
                                            <option key={p._id} value={p._id}>
                                                {p.name}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="">No products available</option>
                                    )}
                                </select>

                                {/* Quantity input */}
                                <input
                                    type="number"
                                    min={1}
                                    value={quantity}
                                    onChange={(e) =>
                                        setQuantity(e.target.value === "" ? "" : parseInt(e.target.value))
                                    }
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
                                            <option key={s._id} value={s.size}>
                                                {s.size}
                                            </option>
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

                                {/* Show which employee is adding */}
                                {repliedBy && (
                                    <p style={{ fontSize: "12px", color: "#555", marginTop: "5px" }}>
                                        Adding as: <strong>{repliedBy}</strong>
                                    </p>
                                )}

                                <button onClick={() => handleAddProduct(inq._id)}>Add Product</button>
                            </div>
                        )}

                    </div>
                ))}
            </div>
        </div>
    );
};

export default Inquiries;
