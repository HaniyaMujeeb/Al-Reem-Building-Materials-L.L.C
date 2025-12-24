import React, { useState } from "react";
import axios from "axios";
import { backendURL } from "../App";
import { toast } from "react-toastify";

const ReplyModel = ({ inquiry, token, close, refresh }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const sendReply = async () => {
    if (!message.trim()) return toast.error("Reply cannot be empty");

    try {
      setLoading(true);
      const res = await axios.post(
        `${backendURL}/api/admin/inquiries/reply`,
        { inquiryId: inquiry._id, replyMessage: message },
        { headers: { token } }
      );

      if (res.data.success) {
        toast.success("Reply sent successfully");
        refresh(); // refresh the inquiry list
        close();   // close modal
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
          <button onClick={close} disabled={loading}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ReplyModel;
