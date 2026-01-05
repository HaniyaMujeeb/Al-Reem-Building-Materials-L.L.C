import Employee from "../Models/EmployeeModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AuditLog from "../Models/AuditLogModel.js";
import crypto from "crypto";
import transporter from "../Config/Nodemailer.js"; // Make sure you have this setup

/* =====================================
   CREATE JWT TOKEN
===================================== */
const createEmployeeToken = async (employee) => {
  const token = jwt.sign(
    { id: employee._id, role: employee.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  // 📝 LOGIN AUDIT LOG
  try {
    await AuditLog.create({
      action: employee.role === "admin" ? "ADMIN_LOGIN" : "EMPLOYEE_LOGIN",
      performedBy: employee._id,
      details: `${employee.role === "admin" ? "Admin" : "Employee"} ${employee.email} logged in`,
    });
  } catch (err) {
    console.error("Audit log failed:", err.message);
  }

  return token;
};


/* =====================================
   EMPLOYEE LOGIN (ADMIN PANEL)
===================================== */
export const employeeLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    // ⚡ Select password explicitly because select: false in schema
    const employee = await Employee.findOne({ email }).select("+password");
    if (!employee) {

      return res.status(400).json({ success: false, message: "Employee not found" });
    }

    // Compare password
    const isMatch = await employee.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid password" });
    }

     // ✅ Generate token AND log audit
    const token = await createEmployeeToken(employee); 


    res.json({
      success: true,
      token,
      employee: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        role: employee.role
      }
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};




/* =====================================
   REQUEST PASSWORD RESET
===================================== */
export const requestEmployeePasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res.json({ success: false, message: "Employee not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    employee.resetToken = resetToken;
    employee.resetTokenExpire = Date.now() + 15 * 60 * 1000; // 15 mins
    await employee.save();

    const resetLink = `${process.env.ADMIN_URL}/reset-password/${resetToken}`;

    await transporter.sendMail({
      to: employee.email,
      subject: "Reset your admin password",
      html: `
        <p>Hello ${employee.name},</p>
        <p>Click below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link expires in 15 minutes.</p>
      `
    });

    res.json({ success: true, message: "Reset link sent" });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/* =====================================
   RESET PASSWORD
===================================== */
export const resetEmployeePassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const employee = await Employee.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() }
    });

    if (!employee) {
      return res.json({ success: false, message: "Invalid or expired token" });
    }

    employee.password = password; // hashed by pre-save hook
    employee.resetToken = undefined;
    employee.resetTokenExpire = undefined;

    await employee.save();

    // Optional: Audit log
    await AuditLog.create({
      action: "RESET_PASSWORD",
      performedBy: req.user.id,
      targetEmployee: employee._id,
      details: `Employee ${employee.email} reset their password`
    });

    res.json({ success: true, message: "Password updated successfully" });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/* =====================================
   GET ALL ACTIVE EMPLOYEES
===================================== */
export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee
      .find({ active: true })
      .select("-password")
      .sort({ name: 1 });

    res.json({ success: true, data: employees });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/* =====================================
   ADD NEW EMPLOYEE
===================================== */
export const addEmployee = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.json({
        success: false,
        message: "Name, email, and password are required"
      });
    }

    const exists = await Employee.findOne({ email });
    if (exists) {
      return res.json({
        success: false,
        message: "Employee already exists"
      });
    }

    const employee = await Employee.create({
      name,
      email,
      password, // hashed by schema
      role
    });

    if (req.user) {
      await AuditLog.create({
        action: "ADD_EMPLOYEE",
        performedBy: req.user.id,
        targetEmployee: employee._id,
        details: `Employee ${employee.email} added`
      });
    }

    res.json({
      success: true,
      data: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        role: employee.role
      }
    });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/* =====================================
   UPDATE EMPLOYEE
===================================== */
export const updateEmployee = async (req, res) => {
  try {
    const { name, role, password } = req.body;

    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.json({ success: false, message: "Employee not found" });
    }

    if (name !== undefined) employee.name = name;
    if (role !== undefined) employee.role = role;
    if (password) employee.password = password;

    await employee.save();

    await AuditLog.create({
      action: "UPDATE_EMPLOYEE",
      performedBy: req.user.id,
      targetEmployee: employee._id,
      details: `Employee ${employee.email} updated`
    });

    res.json({ success: true, message: "Employee updated successfully" });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/* =====================================
   DEACTIVATE EMPLOYEE
===================================== */
export const deactivateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );

    if (!employee) {
      return res.json({ success: false, message: "Employee not found" });
    }

    // 📝 AUDIT LOG
    await AuditLog.create({
      action: "DEACTIVATE_EMPLOYEE",
      performedBy: req.user.id,
      targetEmployee: employee._id,
      details: `Employee ${employee.email} deactivated`
    });

    res.json({
      success: true,
      message: "Employee deactivated successfully"
    });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/* =====================================
   GET AUDIT LOGS
===================================== */
export const getAuditLogs = async (req, res) => {
  const logs = await AuditLog.find()
    .populate("performedBy", "name email")
    .populate("targetEmployee", "name email")
    .sort({ createdAt: -1 });

  res.json({ success: true, data: logs });
};



/* =====================================
   ADMIN LOGIN
===================================== */
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Employee
      .findOne({ email, role: "admin", active: true })
      .select("+password");

    if (!admin) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = await createEmployeeToken(admin);

    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// Get admin profile
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Employee.findById(req.user.id).select("-password");
    if (!admin) return res.status(404).json({ success: false, message: "Admin not found" });

    res.json({ success: true, user: admin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update admin profile
export const updateAdminProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const updateData = { name, email };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const admin = await Employee.findByIdAndUpdate(req.user.id, updateData, { new: true }).select("-password");

    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    res.json({ success: true, user: admin, message: "Profile updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};




// Get employee profile
export const getEmployeeProfile = async (req, res) => {
  try {
    const employee = await Employee.findById(req.user.id).select("-password");
    if (!employee) return res.status(404).json({ success: false, message: "Employee not found" });

    res.json({ success: true, user: employee });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update employee profile
export const updateEmployeeProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const updateData = { name, email };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const employee = await Employee.findByIdAndUpdate(req.user.id, updateData, { new: true }).select("-password");

    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    res.json({ success: true, user: employee, message: "Profile updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



