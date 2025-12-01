import express from "express";
import {
  loginUser,
  registerUser,
  getProfile,
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", loginUser);
router.get("/profile", protect, getProfile);

export default router;
