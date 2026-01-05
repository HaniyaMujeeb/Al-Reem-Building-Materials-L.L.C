import mongoose from "mongoose";

const AuditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true
      // e.g. "ADD_EMPLOYEE", "DEACTIVATE_EMPLOYEE", "UPDATE_EMPLOYEE"
    },

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true
    },

    targetEmployee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee"
    },

    details: {
      type: String
    }
  },
  { timestamps: true }
);

export default mongoose.model("AuditLog", AuditLogSchema);
