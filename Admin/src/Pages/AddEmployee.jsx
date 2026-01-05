import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendURL } from "../App";

const AddEmployee = ({ onSuccess, role }) => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [roleState, setRoleState] = useState("staff"); // <-- renamed
    const [loading, setLoading] = useState(false);


    // Block non-admins
    if (role !== "admin") {
        return <p style={{ color: "red" }}>Access denied. Admins only.</p>;
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem("adminToken");
            if (!token) {
                toast.error("Admin not logged in");
                setLoading(false);
                return;
            }

            const response = await axios.post(
                `${backendURL}/api/admin/employees/add`,
                { name, email, password, role: roleState }, // use roleState here
                {
                    headers: { token },
                }
            );

            if (response.data.success) {
                toast.success("Employee added successfully!");
                setName("");
                setEmail("");
                setPassword("");
                setRoleState("staff"); // reset state
                if (onSuccess) onSuccess();
            } else {
                toast.error(response.data.message || "Failed to add employee");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Error adding employee");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-employee-container">
            <h2>Add New Employee:</h2>
            <form onSubmit={handleSubmit} className="add-employee-form">
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Role:</label>
                    <select value={roleState} onChange={(e) => setRoleState(e.target.value)}>
                        <option value="staff">Staff</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Adding..." : "Add Employee"}
                </button>
            </form>
        </div>
    );
};

export default AddEmployee;
