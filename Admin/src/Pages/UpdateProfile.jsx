import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { decodeToken } from "../utils/Auth"; // ✅ YOUR UTIL
import { backendURL } from "../App";

const UpdateProfile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
  });

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    const employeeToken = localStorage.getItem("employeeToken");

    const token = adminToken || employeeToken;

    if (!token) {
      alert("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    const decoded = decodeToken(token);

    if (!decoded || !decoded.role) {
      alert("Invalid session. Please login again.");
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const url =
          decoded.role === "admin"
            ? `${backendURL}/api/admin/employees/admin`
            : `${backendURL}/api/admin/employees/employee/me`;

        const res = await axios.get(url, {
          headers: { token }, // ✅ BACKEND EXPECTS THIS
        });

        if (res.data.success) {
          setUser({
            name: res.data.user.name,
            email: res.data.user.email,
            role: decoded.role,
          });
        } else {
          throw new Error("Failed to fetch profile");
        }
      } catch (error) {
        console.error("Failed to load profile", error);
        alert("Failed to load profile");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const adminToken = localStorage.getItem("adminToken");
    const employeeToken = localStorage.getItem("employeeToken");
    const token = adminToken || employeeToken;

    if (!token) {
      alert("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    try {
      const url =
        user.role === "admin"
          ? `${backendURL}/api/admin/employees/admin/update-profile`
          : `${backendURL}/api/admin/employees/employee/update-profile`;

      const res = await axios.put(
        url,
        {
          name: user.name,
          email: user.email,
          password,
        },
        {
          headers: { token }, // ✅
        }
      );

      if (res.data.success) {
        setMessage("Profile updated successfully");
        setPassword("");
      } else {
        setMessage(res.data.message || "Update failed");
      }
    } catch (error) {
      console.error("Profile update failed", error);
      setMessage("Error updating profile");
    }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="update-profile">
      <h2>Update Profile:</h2>
      <p>
        Role: <strong>{user.role}</strong>
      </p>

      {message && <p className="message">{message}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={user.name}
          placeholder="Name"
          onChange={(e) => setUser({ ...user, name: e.target.value })}
          required
        />

        <input
          type="email"
          value={user.email}
          placeholder="Email"
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          required
        />

        <input
          type="password"
          value={password}
          placeholder="New password (optional)"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default UpdateProfile;
