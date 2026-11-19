
import mongoose from "mongoose";
import dotenv from "dotenv";
import Employee from "./Models/EmployeeModel.js";

dotenv.config();

const createAdmin = async () => {
  try {
    const uri = `${process.env.MONGODB_URI.replace(/\/+$/, "")}/alreembuildingmaterialsllc`;

    await mongoose.connect(uri);
    console.log("Database connected");

    const existingAdmin = await Employee.findOne({ role: "admin" });

    if (existingAdmin) {
      console.log("An admin account already exists:", existingAdmin.email);
      return;
    }

    const admin = await Employee.create({
      name: "Admin",
      email: "reembuilding@gmail.com",
      password: "reem786",
      role: "admin",
      active: true
    });

    console.log("Admin created successfully:", admin.email);
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await mongoose.disconnect();
  }
};

createAdmin();
