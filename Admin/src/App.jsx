import React, { useState, useEffect, useContext } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Navbar from './Components/Navbar';
import Sidebar from './Components/Sidebar';
import ThemeToggle from './Components/ThemeToggle.jsx';
import { LoaderContext } from './Components/LoaderContext.jsx';

import Login from './Components/Login';
import AdminHome from './Pages/Home';
import Add from './Pages/Add';
import List from './Pages/List';
import Orders from './Pages/Orders';
import Inquiries from './Pages/Inquiry';
import EditProduct from './Pages/EditProduct';
import AddEmployee from './Pages/AddEmployee';
import AdminAuditLogs from './Pages/AdminAuditLog.jsx';
import UpdateProfile from './Pages/UpdateProfile.jsx';
import AdminEmployees from './Pages/EmployeeList.jsx';

export const backendURL = import.meta.env.VITE_BACKEND_URL;
export const currency = 'AED';

const App = () => {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");

  const { loading, setLoading } = useContext(LoaderContext);
  const location = useLocation();

  // ✅ Restore login state on page load
  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    const employeeToken = localStorage.getItem("employeeToken");
    const storedUser = JSON.parse(localStorage.getItem("authUser")) || null;
    const storedRole = localStorage.getItem("authRole") || "";

    if (adminToken) {
      setToken(adminToken);
      setUser(storedUser);
      setRole("admin");
    } else if (employeeToken) {
      setToken(employeeToken);
      setUser(storedUser);
      setRole("staff");
    }
  }, []);

  // Update role if token/user changes
  useEffect(() => {
    if (token && user?.role) {
      setRole(user.role);
    }
  }, [token, user]);

  // Loader for route changes
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Show login page if no token
  if (!token) return <Login setToken={setToken} setUser={setUser} setRole={setRole} />;

  return (
    <div className="app-container">
      <ToastContainer />
      <ThemeToggle />
      {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}

      <Navbar setToken={setToken} />

      <div className="app-content">
        <Sidebar role={role} />

        <div className="main-content">
          <Routes>
            {role === "admin" && (
              <>
                <Route path="/" element={<AdminHome token={token} />} />
                <Route path="/add-employee" element={<AddEmployee role={role} />} />
                <Route path="/logs" element={<AdminAuditLogs role={role} />} />
                <Route path="/employee-list" element={<AdminEmployees role={role} />} />
              </>
            )}

            {role === "staff" && (
              <Route path="/employee-home" element={<AdminHome token={token} />} />
            )}

            {/* Shared routes */}
            <Route path="/add" element={<Add token={token} />} />
            <Route path="/list" element={<List token={token} />} />
            <Route path="/orders" element={<Orders token={token} />} />
            <Route path="/inquiries" element={<Inquiries token={token} />} />
            <Route path="/edit-product/:id" element={<EditProduct token={token} />} />
            <Route path="/update-profile" element={<UpdateProfile token={token} />} />

            <Route path="*" element={<Navigate to={role === "admin" ? "/" : "/employee-home"} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};


export default App;
