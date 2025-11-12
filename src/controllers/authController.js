import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// 🔑 Tạo JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || "secretkey",
    { expiresIn: "30d" }
  );
};

// 🧩 [POST] /api/auth/login
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Nếu người dùng chỉ nhập MSSV, tự động nối domain
  const isMSSV = /^\d{8}$/.test(email);
  const finalEmail = isMSSV ? `${email}@gm.uit.edu.vn` : email;

  const user = await User.findOne({ email: finalEmail });

  if (user && (await user.matchPassword(password))) {
    res.json({
      token: generateToken(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
});

// 🧩 [POST] /api/auth/register
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: "User already exists" });
  if (role === "admin")
    return res.status(403).json({ message: "Cannot self-register as admin" });

  const user = await User.create({ name, email, password, role });
  res.status(201).json({
    token: generateToken(user),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// 🧩 [GET] /api/auth/profile
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});
