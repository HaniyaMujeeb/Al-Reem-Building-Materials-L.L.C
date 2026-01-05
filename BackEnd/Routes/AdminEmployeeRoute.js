import express from "express";
import adminAuth from "../Middleware/AdminAuth.js";
import employeeAuth from "../Middleware/EmployeeAuth.js"; // 👈 middleware for employee routes
import {
  employeeLogin,
  getEmployees,
  addEmployee,
  deactivateEmployee,
  getAuditLogs,
  requestEmployeePasswordReset,
  resetEmployeePassword,
  adminLogin,
  getAdminProfile,
  updateAdminProfile,
  getEmployeeProfile,
  updateEmployeeProfile,
} from "../Controllers/AdminEmployeeController.js";

const adminemployeeRouter = express.Router();

// 🔐 LOGIN ROUTES (no middleware)
adminemployeeRouter.post("/login", employeeLogin);      // Employee login
adminemployeeRouter.post("/admin-login", adminLogin);   // Admin login

// 🔒 PROTECTED ROUTES
adminemployeeRouter.get("/", adminAuth, getEmployees);
adminemployeeRouter.post("/add", adminAuth, addEmployee);
adminemployeeRouter.put("/deactivate/:id", adminAuth, deactivateEmployee);

adminemployeeRouter.get("/logs", adminAuth, getAuditLogs);

adminemployeeRouter.post("/forgot-password", requestEmployeePasswordReset);
adminemployeeRouter.post("/reset-password", resetEmployeePassword);

// 👤 PROFILE ROUTES
// Admin profile routes
adminemployeeRouter.get("/admin", adminAuth, getAdminProfile);
adminemployeeRouter.put("/admin/update-profile", adminAuth, updateAdminProfile);

// Employee profile routes
adminemployeeRouter.get("/employee/me", employeeAuth, getEmployeeProfile);
adminemployeeRouter.put("/employee/update-profile", employeeAuth, updateEmployeeProfile);

export default adminemployeeRouter;
