import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Employee = mongoose.model("Employee", EmployeeSchema);
export default Employee;
