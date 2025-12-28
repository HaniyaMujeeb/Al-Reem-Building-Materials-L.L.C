import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { backendURL } from '../App';

const AdminHome = ({ token }) => {
    const navigate = useNavigate();
    const [repliedCount, setRepliedCount] = useState(0);
    const [pendingCount, setPendingCount] = useState(0);

    const quickLinks = [
        { title: "Add / Update Products", path: "/add" },
        { title: "View Orders", path: "/orders" },
        { title: "View Products", path: "/list" },
        { title: "View Inquiries", path: "/inquiries" }
    ];

    useEffect(() => {
        const fetchInquiryStats = async () => {
            try {
                const token = localStorage.getItem('token'); // get the admin token
                const res = await axios.get(`${backendURL}/api/admin/inquiries/stats`, {
                    headers: { token }  // matches your middleware expecting req.headers.token
                });
                setRepliedCount(res.data.replied || 0);
                setPendingCount(res.data.pending || 0);
            } catch (err) {
                console.error(err);
            }
        };

        fetchInquiryStats();
    }, []); // run on component mount


    return (
        <div className="admin-home">
            <h1>👋 Welcome Back, Admin</h1>
            <p>Manage your store effectively and stay updated.</p>

            {/* ===== Inquiry Status Cards ===== */}
            <div className="overview-cards">
                <div className="card">
                    <h3>📬 Replied Inquiries</h3>
                    <h2>{repliedCount}</h2>
                </div>
                <div className="card">
                    <h3>⏳ Pending Inquiries</h3>
                    <h2>{pendingCount}</h2>
                </div>
            </div>

            {/* ===== Quick Links ===== */}
            <div className="quick-links">
                {quickLinks.map((link, index) => (
                    <div
                        key={index}
                        className="link-card"
                        onClick={() => navigate(link.path)}
                    >
                        <h3>{link.title}</h3>
                        {link.path === "/inquiries" && pendingCount > 0 && (
                            <span className="badge"> </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminHome;
