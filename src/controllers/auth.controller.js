import jwt from "jsonwebtoken";
import User from "../models/User.js";

const sign = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

export const register = async (req, res) => {
  const { name, email, password, studentCode } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: "Email already in use" });
  const user = await User.create({ name, email, password, studentCode });
  res.status(201).json({ user: { id: user._id, name, email, role: user.role }, token: sign(user) });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password)))
    return res.status(400).json({ message: "Invalid credentials" });
  res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token: sign(user) });
};

export const profile = async (req, res) => {
  const u = req.user;
  res.json({ user: { id: u._id, name: u.name, email: u.email, role: u.role } });
};
