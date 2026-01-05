import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { assets } from '../assets/assets';
import { backendURL } from '../App';
import { decodeToken } from '../utils/Auth.js'; // ✅ import shared helper

const Sidebar = () => {
  const [pendingCount, setPendingCount] = useState(0);
  const [role, setRole] = useState("");

  useEffect(() => {
    // ✅ Check both admin and employee token
    const adminToken = localStorage.getItem("adminToken");
    const employeeToken = localStorage.getItem("employeeToken");
    const token = adminToken || employeeToken;

    if (!token) return;

    const payload = decodeToken(token);
    if (!payload) return;

    setRole(payload.role || "");

    const fetchPendingCount = async () => {
      try {
        const res = await axios.get(`${backendURL}/api/admin/inquiries`, {
          headers: { token },
        });

        if (res.data.success && Array.isArray(res.data.data)) {
          // ✅ Only admin inquiries are counted, employees see 0
          const pending = res.data.data.filter(
            i => i.status?.toLowerCase() === "pending"
          );
          setPendingCount(pending.length);
        }
      } catch (err) {
        console.error("Failed to fetch inquiries:", err);
      }
    };

    fetchPendingCount();
    const interval = setInterval(fetchPendingCount, 10000);
    return () => clearInterval(interval);
  }, []);


  return (
    <div className='sidebar'>
      <div className='sidebar-menu'>
        {role === "admin" && (
          <>
            <NavLink className='sidebar-link' to="/add-employee">
              <img src={assets.add_icon} alt='' />
              <p>Add Employee</p>
            </NavLink>

            <NavLink className='sidebar-link' to="/logs">
              <img src={assets.user_log} alt='' />
              <p>User Actions</p>
            </NavLink>

            <NavLink className='sidebar-link' to="/employee-list">
              <img src={assets.employee_list} alt='' />
              <p>Employee List</p>
            </NavLink>
          </>
        )}

        
        <NavLink className='sidebar-link' to="/inquiries">
          <img src={assets.inquiry_icon} alt='' />
          <p>
            Inquiries
            {pendingCount > 0 && <span className="counterbadge">{pendingCount}</span>}
          </p>
        </NavLink>

        <NavLink className='sidebar-link' to="/add">
          <img src={assets.add_icon} alt='' />
          <p>Add Products</p>
        </NavLink>

        <NavLink className='sidebar-link' to="/list">
          <img src={assets.order_icon} alt='' />
          <p>List Products</p>
        </NavLink>

        <NavLink className='sidebar-link' to="/orders">
          <img src={assets.order_icon} alt='' />
          <p>Orders</p>
        </NavLink>



        <NavLink className='sidebar-link' to="/update-profile">
          <img src={assets.update_profile} alt='' />
          <p>Update Profile</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
