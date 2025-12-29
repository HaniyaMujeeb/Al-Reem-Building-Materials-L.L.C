import React, { useState } from "react";
import axios from "axios";
import { backendURL } from "../App";
import { toast } from "react-toastify";

const ReplyModel = ({ inquiry, token, close, refresh }) => {
  const [message, setMessage] = useState("");
  const [repliedBy, setRepliedBy] = useState(""); // ✅ added
  const [loading, setLoading] = useState(false);


  const sendReply = async () => {
    if (!repliedBy) return toast.error("Please select employee name");
    if (!message.trim()) return toast.error("Reply cannot be empty");

    try {
      setLoading(true);
      const res = await axios.post(
        `${backendURL}/api/admin/inquiries/reply`,
        {
          inquiryId: inquiry._id,
          replyMessage: message,
          repliedBy: repliedBy, // ✅ sent to backend
        },
        { headers: { token } }
      );

      if (res.data.success) {
        toast.success("Reply sent successfully");
        refresh();
        close();
      } else {
        toast.error(res.data.message || "Reply failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Reply failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Reply to {inquiry.userName}</h3>

        {/* ✅ Employee selection */}
        <select
          value={repliedBy}
          onChange={(e) => setRepliedBy(e.target.value)}
          disabled={loading}
        >
          <option value="">Select Employee</option>
          {employees.map((emp) => (
            <option key={emp} value={emp}>
              {emp}
            </option>
          ))}
        </select>

        <textarea
          rows="5"
          placeholder="Type your reply..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={loading}
        />

        <div className="modal-actions">
          <button onClick={sendReply} disabled={loading}>
            {loading ? "Sending..." : "Send"}
          </button>
          <button onClick={close} disabled={loading}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReplyModel;
