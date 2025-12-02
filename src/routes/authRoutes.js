import express from "express";
import {
  loginUser,
  getProfile,
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 * name: Auth
 * description: Quản lý xác thực (Đăng nhập)
 */

/**
 * @swagger
 * /api/auth/login:
 * post:
 * summary: Đăng nhập hệ thống
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * email:
 * type: string
 * default: "student"
 * password:
 * type: string
 * default: "1234"
 * responses:
 * 200:
 * description: Đăng nhập thành công (Trả về Token)
 * 401:
 * description: Sai email hoặc mật khẩu
 */
router.post("/login", loginUser);

/**
 * @swagger
 * /api/auth/profile:
 * get:
 * summary: Lấy thông tin user hiện tại (Yêu cầu Token)
 * tags: [Auth]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Trả về thông tin user
 */
router.get("/profile", protect, getProfile);

export default router;
