import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

// ✅ Bắt buộc có token
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log("🔑 Incoming token:", token);
      console.log("🔑 JWT_SECRET used:", process.env.JWT_SECRET);

      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.error("❌ Token verification failed:", error.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
});

// ✅ Chỉ admin
export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") next();
  else res.status(403).json({ message: "Not authorized as admin" });
};

// ✅ Token optional (không bắt buộc)
export const authOptional = asyncHandler(async (req, res, next) => {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith("Bearer ")) {
    try {
      const token = auth.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
      req.user = await User.findById(decoded.id).select("-password");
    } catch (error) {
      console.warn("⚠️ Invalid token ignored in authOptional");
    }
  }
  next();
});

// ✅ Alias cho protect (một số file BE gọi là authRequired)
export const authRequired = protect;
