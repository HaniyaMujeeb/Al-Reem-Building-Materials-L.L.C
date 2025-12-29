import Employee from "../Models/EmployeeModel.js";

// GET all active employees
export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({ active: true }).sort({ name: 1 });
    res.json({ success: true, data: employees });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// ADD new employee
export const addEmployee = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.json({ success: false, message: "Employee name is required" });
    }

    const exists = await Employee.findOne({ name });
    if (exists) {
      return res.json({ success: false, message: "Employee already exists" });
    }

    const employee = await Employee.create({ name });
    res.json({ success: true, data: employee });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// DEACTIVATE employee (soft delete)
export const deactivateEmployee = async (req, res) => {
  try {
    await Employee.findByIdAndUpdate(req.params.id, { active: false });
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
