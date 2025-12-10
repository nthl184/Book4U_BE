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
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: Email or 8-digit student ID (MSSV). MSSV will be converted to email automatically.
 *           example: "21520000"
 *         password:
 *           type: string
 *           format: password
 *           example: "123456"
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/AuthLoginRequest"
 *     responses:
 *       "200":
 *         type: object
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthLoginResponse"
 *         example:
 *           token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *           user:
 *             id: "66f123abcd1234abcd1234aa"
 *             name: "Nguyen Van A"
 *             email: "21520000@gm.uit.edu.vn"
 *             role: "student"
 *       "401":
 *         type: object
 *         description: Invalid email or password
 *         properties:
 *           message:
 *             type: string
 *           example:
 *             message: "Something went wrong"
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
 *         example:
 *           id: "66f123abcd1234abcd1234aa"
 *           name: "Nguyen Van A"
 *           email: "21520000@gm.uit.edu.vn"
 *           role: "student"
 *       "401":
 *         description: Unauthorized
 *       "404":
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *         example:
 *           message: "Something went wrong"
 */
router.get("/profile", protect, getProfile);


export default router;