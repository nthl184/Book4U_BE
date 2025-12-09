import express from "express";
import { loginUser, getProfile } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and user profile
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Đăng nhập hệ thống
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 default: "22520350"
 *                 description: MSSV hoặc Email
 *               password:
 *                 type: string
 *                 default: "1234"
 *                 description: Mật khẩu
 *     responses:
 *       200:
 *         description: Đăng nhập thành công (Trả về Token)
 *       401:
 *         description: Sai tài khoản hoặc mật khẩu
 */
router.post("/login", loginUser);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Lấy thông tin user hiện tại (Yêu cầu Token)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về thông tin user
 *       401:
 *         description: Chưa đăng nhập
 */
router.get("/profile", protect, getProfile);


export default router;