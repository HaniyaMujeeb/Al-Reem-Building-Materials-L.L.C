import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendURL } from "../App";
import { toast } from "react-toastify";
import { assets } from '../assets/assets';

const Inquiries = ({ token }) => {
    const [inquiries, setInquiries] = useState([]);
    const [search, setSearch] = useState("");
    const [replyingInquiryId, setReplyingInquiryId] = useState(null);
    const [replyMessage, setReplyMessage] = useState("");
    const [repliedBy, setRepliedBy] = useState("");
    const [addingProductInquiryId, setAddingProductInquiryId] = useState(null);
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [loading, setLoading] = useState(false);
    const [employees, setEmployees] = useState([]);

    // User info
    const userInfo = JSON.parse(localStorage.getItem("authUser") || "{}");
    const isAdmin = userInfo.role === "admin";
    const loggedInEmployeeName = userInfo.name || "";

    // Fetch inquiries for both admin and employee (no Bearer)
    const fetchInquiries = async () => {
        setLoading(true);
        try {
            const url = `${backendURL}/api/admin/inquiries`; // unified route

            const res = await axios.get(url, {
                headers: {
                    token: token, // <-- send token in 'token' header
                },
            });

            if (res.data.success && Array.isArray(res.data.data)) {
                setInquiries(res.data.data);
            } else {
                setInquiries([]);
                toast.error(res.data.message || "No inquiries found");
            }
        } catch (err) {
            setInquiries([]);
            toast.error("Failed to fetch inquiries");
            console.error("Fetch inquiries error:", err);
        } finally {
            setLoading(false);
        }
    };


    // Fetch products
    const fetchProducts = async () => {
        setLoadingProducts(true);
        try {
            const res = await axios.get(`${backendURL}/api/product/list`);
            setProducts(res.data.success && Array.isArray(res.data.data) ? res.data.data : []);
            if (!res.data.success) toast.error(res.data.message || "No products found");
        } catch {
            setProducts([]);
            toast.error("Failed to fetch products");
        } finally {
            setLoadingProducts(false);
        }
    };

    // Fetch employees (admin only)
    const fetchEmployees = async () => {
        if (!isAdmin) return;
        try {
            const res = await axios.get(`${backendURL}/api/admin/employees`, { headers: { token } });
            setEmployees(res.data.success ? res.data.data : []);
            if (!res.data.success) toast.error(res.data.message || "Failed to load employees");
        } catch {
            setEmployees([]);
            toast.error("Failed to load employees");
        }
    };

    useEffect(() => {
        fetchInquiries();
        fetchProducts();
        fetchEmployees();
    }, []);

    // ----- Handlers -----
    const deleteInquiry = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        setLoading(true);
        try {
            const res = await axios.delete(`${backendURL}/api/admin/inquiries/${id}`, { headers: { token } });
            if (res.data.success) toast.success("Inquiry deleted");
            else toast.error(res.data.message);
            fetchInquiries();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const sendReply = async (inquiryId, senderName) => {
        if (!senderName) return toast.error("Employee name missing");
        if (!replyMessage.trim()) return toast.error("Reply cannot be empty");

        setLoading(true);
        try {
            const footer = `
<br><br>---
<br>If you would like to purchase this product, please contact us on WhatsApp - +971556478562,
<br>call us on this number - 072288872, or reply back to this email to confirm your order.
<br>If you would like to pay by card, please visit our store.
<br>If you prefer Cash on Delivery, please send us your address along with the reply and confirm your payment method.
`;
            const fullMessage = replyMessage + footer;

            const url = isAdmin
                ? `${backendURL}/api/admin/inquiries/reply`
                : `${backendURL}/api/employee/inquiries/reply`;

            const res = await axios.post(url, { inquiryId, replyMessage: fullMessage, repliedBy: senderName }, { headers: { token } });

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
            const url = isAdmin
                ? `${backendURL}/api/admin/inquiries/add-product`
                : `${backendURL}/api/employee/inquiries/add-product`;

            const res = await axios.post(url, { inquiryId, product: productToAdd }, { headers: { token } });
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

    const handleRemoveProduct = async (inquiryId, itemId) => {
        if (!window.confirm("Remove this product from inquiry?")) return;
        setLoading(true);
        try {
            const url = isAdmin
                ? `${backendURL}/api/admin/inquiries/remove-product`
                : `${backendURL}/api/employee/inquiries/remove-product`;

            const res = await axios.post(url, { inquiryId, itemId }, { headers: { token } });
            if (res.data.success) toast.success("Product removed");
            else toast.error(res.data.message);
            fetchInquiries();
        } catch {
            toast.error("Failed to remove product");
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (inquiryId, itemId, newQty) => {
        if (newQty < 1) return;
        setLoading(true);
        try {
            const url = isAdmin
                ? `${backendURL}/api/admin/inquiries/update-quantity`
                : `${backendURL}/api/employee/inquiries/update-quantity`;

            const res = await axios.post(url, { inquiryId, itemId, quantity: newQty }, { headers: { token } });
            if (!res.data.success) toast.error(res.data.message);
            fetchInquiries();
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

    useEffect(() => {
        if (replyingInquiryId && !isAdmin) {
            const inq = inquiries.find(i => i._id === replyingInquiryId);
            if (!inq) return;

            const productsText =
                inq.items?.map(item => item.productName).join(", ") || "";

            setReplyMessage(
                `Hi, this is ${loggedInEmployeeName} from our sales team regarding your inquiry about "${productsText}".\n\n`
            );
        }
    }, [replyingInquiryId]);


    return (
        <div className="inquiries-page">
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
                        {/* --- HEADER --- */}
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

                        {/* --- PRODUCTS --- */}
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

                        {/* --- ACTIONS --- */}
                        <div className="actions">
                            <button
                                onClick={() =>
                                    setReplyingInquiryId(replyingInquiryId === inq._id ? null : inq._id)
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


                        {/* --- REPLY BOX --- */}
                        {/* --- REPLY BOX --- */}
                        {replyingInquiryId === inq._id && (
                            <div className="reply-box">

                                {isAdmin && (
                                    <select
                                        value={repliedBy}
                                        onChange={(e) => {
                                            const selectedEmployee = e.target.value;
                                            setRepliedBy(selectedEmployee);

                                            if (selectedEmployee) {
                                                const productsText =
                                                    inq.items?.map(item => item.productName).join(", ") || "";

                                                setReplyMessage(
                                                    `Hi, this is ${selectedEmployee} from our sales team regarding your inquiry about "${productsText}".\n\n`
                                                );
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
                                )}

                                {(!isAdmin || repliedBy) && (
                                    <textarea
                                        rows="6"
                                        value={replyMessage}
                                        onChange={(e) => setReplyMessage(e.target.value)}
                                        placeholder="Type your reply..."
                                    />
                                )}

                                {(!isAdmin || repliedBy) && (
                                    <button
                                        onClick={() =>
                                            sendReply(
                                                inq._id,
                                                isAdmin ? repliedBy : loggedInEmployeeName
                                            )
                                        }
                                    >
                                        Send Reply
                                    </button>
                                )}

                            </div>
                        )}



                        {/* --- ADD PRODUCT BOX --- */}
                        {addingProductInquiryId === inq._id && (
                            <div className="add-product-box">
                                <select
                                    disabled={loadingProducts || !products?.length}
                                    value={selectedProduct?._id || ""}
                                    onChange={(e) => {
                                        const prod = products.find((p) => p._id === e.target.value);
                                        setSelectedProduct(prod);
                                        setSelectedSize("");
                                    }}
                                >
                                    <option value="">Select Product</option>
                                    {products.map((p) => (
                                        <option key={p._id} value={p._id}>{p.name}</option>
                                    ))}
                                </select>

                                <input
                                    type="number"
                                    min={1}
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value === "" ? "" : parseInt(e.target.value))}
                                    placeholder="Quantity"
                                />

                                {selectedProduct?.sizes?.length > 0 && (
                                    <select
                                        value={selectedSize}
                                        onChange={(e) => setSelectedSize(e.target.value)}
                                    >
                                        <option value="">Select Size</option>
                                        {selectedProduct.sizes.map((s) => (
                                            <option key={s._id} value={s.size}>{s.size}</option>
                                        ))}
                                    </select>
                                )}

                                {selectedProduct && (
                                    <img
                                        src={selectedProduct.image || assets.no_image}
                                        alt={selectedProduct.name}
                                        style={{ width: "80px", marginTop: "5px" }}
                                    />
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
