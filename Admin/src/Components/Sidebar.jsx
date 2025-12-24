import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import React, { useEffect, useState } from 'react'
import { backendURL } from '../App'
import axios from 'axios'  // ✅ import axios

const Sidebar = () => {
    const [pendingCount, setPendingCount] = useState(0)


    // Function to fetch pending inquiries
    useEffect(() => {
        const fetchPendingCount = async () => {
            const token = localStorage.getItem("admintoken");
            if (!token) return;

            try {
                const res = await axios.get(`${backendURL}/api/admin/inquiries`, {
                    headers: { token },
                });

                if (res.data.success && Array.isArray(res.data.data)) {
                    const pending = res.data.data.filter(
                        i => i.status?.toLowerCase() === "pending"
                    );

                    setPendingCount(pending.length);
                }
            } catch (err) {

            }
        };

        fetchPendingCount();

        // Poll every 10 seconds
        const interval = setInterval(fetchPendingCount, 10000);

        // Clean up interval on unmount
        return () => clearInterval(interval);
        
    }, []);



    return (
        <div className='sidebar'>
            <div className='sidebar-menu'>

                <NavLink className='sidebar-link' to="/add">
                    <img src={assets.add_icon} alt='' />
                    <p> Add Products  </p>
                </NavLink>

                <NavLink className='sidebar-link' to="/list">
                    <img src={assets.order_icon} alt='' />
                    <p> List Products  </p>
                </NavLink>

                <NavLink className='sidebar-link' to="/orders">
                    <img src={assets.order_icon} alt='' />
                    <p> Orders  </p>
                </NavLink>

                <NavLink className='sidebar-link' to="/inquiries">
                    <img src={assets.inquiry_icon} alt='' />
                    <p>
                        Inquiries
                        {pendingCount > 0 && (
                            <span className="counterbadge">{pendingCount}</span>
                        )}
                    </p>
                </NavLink>

            </div>
        </div>
    )
}

export default Sidebar
