import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const EmployeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false
    },

    role: {
      type: String,
      enum: ["admin", "manager", "staff"],
      default: "staff"
    },

    active: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);


EmployeeSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

EmployeeSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("Employee", EmployeeSchema);
