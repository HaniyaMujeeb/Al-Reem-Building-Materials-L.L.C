import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendURL } from "../App";
import { toast } from "react-toastify";


const AdminEmployees = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    // Get admin token from localStorage (raw JWT)
    const token = localStorage.getItem("adminToken");

    const fetchEmployees = async () => {
        if (!token) {
            toast.error("Admin token missing. Please login.");
            setLoading(false);
            return;
        }

        try {
            const res = await axios.get(`${backendURL}/api/admin/employees`, {
                headers: { token },
            });

            if (res.data.success) setEmployees(res.data.data);
            else toast.error(res.data.message || "Failed to fetch employees");
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch employees");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    return (
        <div className="EmployeeList">
            <h2>All Active Employees:</h2>

            {loading && <p className="loading">Loading employees...</p>}

            {!loading && employees.length === 0 && <p className="empty">No active employees found.</p>}

            {!loading && employees.length > 0 && (
                <table className="employee-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((emp) => (
                            <tr key={emp._id}>
                                <td>{emp.name}</td>
                                <td>{emp.email}</td>
                                <td>{emp.role}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminEmployees;
