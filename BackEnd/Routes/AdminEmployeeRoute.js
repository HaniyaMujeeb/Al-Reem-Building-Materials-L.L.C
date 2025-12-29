import express from "express";
import adminAuth from "../Middleware/AdminAuth.js";
import {
  getEmployees,
  addEmployee,
  deactivateEmployee
} from "../Controllers/AdminEmployeeController.js";

const adminemployeeRouter = express.Router();

adminemployeeRouter.get("/", adminAuth, getEmployees);
adminemployeeRouter.post("/add", adminAuth, addEmployee);
adminemployeeRouter.put("/deactivate/:id", adminAuth, deactivateEmployee);

export default adminemployeeRouter;
