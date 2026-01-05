import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { decodeToken } from "../utils/Auth";
import { backendURL } from "../App";

const AdminHome = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
  });

  const [pendingCount, setPendingCount] = useState(0);

  const quickLinks = [
    { title: "Add / Update Products", path: "/add" },
    { title: "Add Employee", path: "/add-employee", adminOnly: true },
    { title: "User Actions", path: "/logs", adminOnly: true },
    { title: "View Orders", path: "/orders" },
    { title: "View Products", path: "/list" },
    { title: "View Inquiries", path: "/inquiries" },
    { title: "Update Profile", path: "/update-profile" },
    { title: "Employee List", path: "/employee-list", adminOnly: true },

  ];

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    const employeeToken = localStorage.getItem("employeeToken");
    const token = adminToken || employeeToken;

    if (!token) {
      navigate("/login");
      return;
    }

    const decoded = decodeToken(token);

    if (!decoded || !decoded.role) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const profileUrl =
          decoded.role === "admin"
            ? `${backendURL}/api/admin/employees/admin`
            : `${backendURL}/api/admin/employees/employee/me`;

        const res = await axios.get(profileUrl, {
          headers: { token },
        });

        if (res.data.success) {
          setUser({
            name: res.data.user.name,
            email: res.data.user.email,
            role: decoded.role,
          });
        } else {
          navigate("/login"); // redirect silently if profile not found
        }
      } catch (err) {
        console.error("Failed to load profile", err);
        navigate("/login"); // silent redirect
      }
    };

    fetchProfile();
  }, [navigate]);

  const isAdmin = user.role === "admin";

  return (
    <div className="admin-home">
      <h1>👋 Welcome Back, {user.name}</h1>

      <p>
        Role: <strong>{user.role}</strong> | Email:{" "}
        <strong>{user.email}</strong>
      </p>

      <div className="quick-links">
        {quickLinks.map((link, index) => {
          if (link.adminOnly && !isAdmin) return null;

          return (
            <div
              key={index}
              className="link-card"
              onClick={() => navigate(link.path)}
            >
              <h3>{link.title}</h3>
              {link.path === "/inquiries" && pendingCount > 0 && (
                <span className="badge">{pendingCount}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminHome;
