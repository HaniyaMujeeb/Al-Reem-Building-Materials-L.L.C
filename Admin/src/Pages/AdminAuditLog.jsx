import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminAuditLogs = ({ role }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [actionFilter, setActionFilter] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    if (role !== "admin") {
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("adminToken");

    if (!token) {
      console.warn("No token found in localStorage!");
      setLoading(false);
      return;
    }

    const fetchLogs = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/admin/employees/logs",
          {
            headers: { token },
          }
        );
        console.log("API response:", res.data);

        if (res.data.success) setLogs(res.data.data);
      } catch (err) {
        console.error("Failed to fetch audit logs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [role]);

  if (role !== "admin") {
    return <p style={{ color: "red" }}>Access denied. Admins only.</p>;
  }

  if (loading) return <p>Loading audit logs...</p>;

  const filteredLogs = logs.filter((log) => {
    const matchesAction = !actionFilter || log.action === actionFilter;
    const matchesEmployee =
      !employeeFilter ||
      log.performedBy?.name
        ?.toLowerCase()
        .includes(employeeFilter.toLowerCase());
    const matchesDate =
      !dateFilter ||
      new Date(log.createdAt).toISOString().slice(0, 10) === dateFilter;

    return matchesAction && matchesEmployee && matchesDate;
  });

  const getBadgeClass = (action) => {
    switch (action) {
      case "ADMIN_LOGIN":
      case "EMPLOYEE_LOGIN":
        return "badge blue";
      case "ADD_EMPLOYEE":
      case "ADD_INQUIRY_PRODUCT":
        return "badge green";
      case "UPDATE_EMPLOYEE":
        return "badge yellow";
      case "DEACTIVATE_EMPLOYEE":
      case "DELETE_INQUIRY":
        return "badge red";
      case "REPLY_INQUIRY":
        return "badge yellow";
      default:
        return "badge brown";
    }
  };

  return (
    <div className="audit-container">
      <h2>User Actions:</h2>

      {/* Filters */}
      <div className="filters">
        <select onChange={(e) => setActionFilter(e.target.value)}>
          <option value="">All Actions</option>
          <option value="ADMIN_LOGIN">Admin Login</option>
          <option value="EMPLOYEE_LOGIN">Employee Login</option>
          <option value="ADD_EMPLOYEE">Add Employee</option>
          <option value="UPDATE_EMPLOYEE">Update Employee</option>
          <option value="DEACTIVATE_EMPLOYEE">Deactivate Employee</option>
          <option value="REPLY_INQUIRY">Reply Inquiry</option>
          <option value="ADD_INQUIRY_PRODUCT">Add Product to Inquiry</option>
          <option value="DELETE_INQUIRY">Delete Inquiry</option>
        </select>

        <input
          type="text"
          placeholder="Filter by employee"
          onChange={(e) => setEmployeeFilter(e.target.value)}
        />

        <input type="date" onChange={(e) => setDateFilter(e.target.value)} />
      </div>

      {/* Table */}
      <table className="audit-table">
        <thead>
          <tr>
            <th>Action</th>
            <th>Performed By</th>
            <th>Target</th>
            <th>Details</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredLogs.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No audit logs found
              </td>
            </tr>
          )}
          {filteredLogs.map((log) => (
            <tr key={log._id}>
              <td>
                <span className={getBadgeClass(log.action)}>{log.action}</span>
              </td>
              <td>
                {log.performedBy?.name}
                <br />
                <small>{log.performedBy?.email}</small>
              </td>
              <td>
                {log.targetEmployee ? (
                  <>
                    {log.targetEmployee.name}
                    <br />
                    <small>{log.targetEmployee.email}</small>
                  </>
                ) : log.targetInquiry ? (
                  <>
                    {log.targetInquiry.title || log.targetInquiry.productName || "-"}
                    <br />
                    <small>{log.targetInquiry._id || "-"}</small>
                  </>
                ) : (
                  "-"
                )}
              </td>
              <td>{log.details || "-"}</td>
              <td>{new Date(log.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminAuditLogs;
