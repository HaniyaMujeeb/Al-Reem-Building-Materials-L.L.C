import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { ShopContext } from "../Context/ShopContext";
import { toast } from "react-toastify";
import "../style.css";

const MyInquiries = () => {
    const { token, backendUrl } = useContext(ShopContext);
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchInquiries = async () => {
            console.log("Fetching inquiries...");
            setLoading(true);
            try {
                const res = await axios.get(`${backendUrl}/api/inquiry/my-inquiries`, {
                    headers: { token },
                });

                console.log("API response:", res.data);

                if (res.data.success) {
                    setInquiries(res.data.inquiries);
                } else {
                    toast.error(res.data.message);
                }
            } catch (err) {
                console.error(err);
                toast.error("Failed to load inquiries");
            }
            setLoading(false);
        };

        fetchInquiries();
    }, [token, backendUrl]);


    return (
        <div className="inquiry-profile-page">
            <div className="inquiry-profile-form-card" style={{ width: "90%", maxWidth: "900px" }}>
                <h2>My Inquiries:</h2>

                {loading && <p>Loading...</p>}

                {inquiries.length === 0 && !loading && <p>No inquiries sent yet.</p>}

                {inquiries.map((inq) => (
                    <div key={inq._id} className="inquiry-card">

                        {/* Header */}
                        <div className="inquiry-header">
                            <div>
                                <h4>Inquiry #{inq._id.slice(-6)}</h4>
                                <span className={`status-badge ${inq.status}`}>
                                    {inq.status.toUpperCase()}
                                </span>
                            </div>
                            <small>{new Date(inq.createdAt).toLocaleDateString()}</small>
                        </div>

                        {/* Message */}
                        <p className="inquiry-message">
                            <strong>Your Message:</strong> {inq.userMessage}
                        </p>

                        {/* Products */}
                        <div className="inquiry-products">
                            {inq.items.map((item, index) => (
                                <div key={index} className="product-row">
                                    <img src={item.image} alt={item.productName} />
                                    <div>
                                        <p className="product-name">{item.productName}</p>
                                        <p className="product-meta">
                                            Qty: {item.quantity} {item.size && `| Size: ${item.size}`}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Admin Reply */}
                        {inq.adminReply?.message && (
                            <div className="admin-reply">
                                <strong>Admin Reply:</strong>
                                <p>{inq.adminReply.message}</p>
                            </div>
                        )}

                    </div>
                ))}

            </div>
        </div>
    );
};

export default MyInquiries;
