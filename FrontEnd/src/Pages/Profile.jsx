import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { ShopContext } from "../Context/ShopContext";
import { toast } from "react-toastify";

const Profile = () => {
  const { token, backendUrl } = useContext(ShopContext);

  const [user, setUser] = useState({ name: "", email: "", phone: "" });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const [passwordConditions, setPasswordConditions] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const [loading, setLoading] = useState(false); // loader state

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/user/profile`, {
          headers: { token }
        });

        if (res.data.success) {
          setUser(res.data.user);
        } else {
          toast.error(res.data.message);
        }
      } catch {
        toast.error("Failed to load profile");
      }
    };

    fetchProfile();
  }, [token, backendUrl]);

  // Password validation
  const validatePassword = (value) => {
    setPassword(value);
    setPasswordConditions({
      minLength: value.length >= 8,
      hasUpperCase: /[A-Z]/.test(value),
      hasLowerCase: /[a-z]/.test(value),
      hasNumber: /[0-9]/.test(value),
      hasSpecialChar: /[!@#$%^&*]/.test(value),
    });
  };

  const isPasswordValid = Object.values(passwordConditions).every(Boolean);

  // Update profile
  const updateProfile = async () => {
    if (password && password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }
    if (password && !isPasswordValid) {
      return toast.error("Password does not meet the conditions");
    }

    try {
      setLoading(true);

      const res = await axios.put(
        `${backendUrl}/api/user/profile`,
        { phone: user.phone, password: password || undefined },
        { headers: { token } }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Profile updated successfully");

        if (res.data.passwordChanged) {
          toast.info("Password changed — a confirmation email has been sent.");
        }

        setPassword("");
        setConfirmPassword("");
        setUser(res.data.user);
      } else {
        toast.error(res.data.message);
      }

      setLoading(false);
    } catch {
      setLoading(false);
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="profile-page">
      {/* Loader */}
      {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}

      <div className="profile-form-card">
        <h2>My Profile</h2>

        <label>Name</label>
        <input value={user.name} disabled />

        <label>Email</label>
        <input value={user.email} disabled />

        <label>Phone</label>
        <input
          value={user.phone || ""}
          onChange={(e) => setUser({ ...user, phone: e.target.value })}
        />

        <label>New Password</label>
        <div style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => validatePassword(e.target.value)}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
          />
          <span
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              fontWeight: "bold"
            }}
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>

        {passwordFocused && password && (
          <ul className="password-conditions">
            <li className={passwordConditions.minLength ? "valid" : "invalid"}>
              ✔ At least 8 characters
            </li>
            <li className={passwordConditions.hasUpperCase ? "valid" : "invalid"}>
              ✔ One uppercase letter
            </li>
            <li className={passwordConditions.hasLowerCase ? "valid" : "invalid"}>
              ✔ One lowercase letter
            </li>
            <li className={passwordConditions.hasNumber ? "valid" : "invalid"}>
              ✔ One number
            </li>
            <li className={passwordConditions.hasSpecialChar ? "valid" : "invalid"}>
              ✔ One special character (!@#$%^&*)
            </li>
          </ul>
        )}

        <label>Confirm Password</label>
        <input
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          onClick={updateProfile}
          disabled={loading || (password && !isPasswordValid)}
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </div>
    </div>
  );
};

export default Profile;
