import React, { useState } from "react";
import axios from "axios";
import { assets } from "../assets/assets";
import { backendURL } from "../App";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = ({ setToken, setUser, setRole }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(""); // ✅ fallback message
    const navigate = useNavigate();

    const onSubmitHandler = async (e, roleType) => {
        e.preventDefault();
        setErrorMessage(""); // reset message on submit

        try {
            const loginUrl =
                roleType === "admin"
                    ? `${backendURL}/api/admin/employees/admin-login`
                    : `${backendURL}/api/admin/employees/login`;

            const response = await axios.post(loginUrl, { email, password });

            if (response.data.success && response.data.token) {
                const token = response.data.token;
                const userInfo = response.data.admin || response.data.employee;

                // Save token by role
                localStorage.setItem(
                    userInfo.role === "admin" ? "adminToken" : "employeeToken",
                    token
                );

                localStorage.setItem("authUser", JSON.stringify(userInfo));
                localStorage.setItem("authRole", userInfo.role);

                setToken(token);
                setUser(userInfo);
                setRole(userInfo.role);

                toast.success(`${userInfo.role} logged in successfully!`);

                navigate(userInfo.role === "admin" ? "/" : "/employee-home");
            }
        } catch (error) {
            // ✅ Show toast or fallback message on login page
            if (
                error.response &&
                (error.response.status === 401 || error.response.status === 400)
            ) {

                setErrorMessage("Invalid email or password"); // fallback
            } else {
                const msg =
                    error.response?.data?.message ||
                    "Login failed. Please try again later.";
                toast.error(msg);
                setErrorMessage(msg);
            }
        }
    };

    return (
        <div className="background-container">
            <img
                src={assets.login_page}
                alt="Admin Panel Logo"
                className="background-image"
            />
            <div className="form-container">
                <div className="form-title-container">
                    <h1 className="form-title-text">Admin Panel</h1>
                    <div className="form-divider"></div>
                </div>

                {errorMessage && (
                    <p
                        style={{
                            color: "red",
                            textAlign: "center",
                            fontWeight: "600",
                            marginBottom: "10px",
                        }}
                    >
                        {errorMessage}
                    </p>
                )}

                <div>
                    <div>
                        <p>Email Address: </p>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            type="email"
                            placeholder="your@email.com"
                            className="form-input"
                            required
                        />
                    </div>

                    <div>
                        <p>Password: </p>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            type="password"
                            placeholder="Enter Your Password"
                            className="form-input"
                            required
                        />
                    </div>

                    <div
                        style={{ display: "flex", gap: "10px", marginTop: "10px" }}
                    >
                        <button
                            className="login-button"
                            onClick={(e) => onSubmitHandler(e, "admin")}
                        >
                            Login as Admin
                        </button>
                        <button
                            className="login-button"
                            onClick={(e) => onSubmitHandler(e, "employee")}
                        >
                            Login as Employee
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

