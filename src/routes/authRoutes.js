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
 *     tags: [Auth]
 *     summary: Login with email or student ID
 *     description: |
 *       Authenticate a user (student or admin).
 *       If an 8-digit student ID (MSSV) is provided as email, the server will automatically convert it to `mssv@gm.uit.edu.vn`.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/AuthLoginRequest"
 *     responses:
 *       "200":
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthLoginResponse"
 *       "401":
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.post("/login", loginUser);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     tags: [Auth]
 *     summary: Get current user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Current authenticated user's profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 *       "401":
 *         description: Unauthorized
 *       "404":
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.get("/profile", protect, getProfile);


export default router;