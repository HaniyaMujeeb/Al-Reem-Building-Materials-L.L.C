import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  try {
    const token = req.headers.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Match your actual roles
    if (!["admin", "manager", "staff"].includes(decoded.role)) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export default authUser;
