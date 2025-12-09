import express from "express";
import {
  getAll,
  getByUser,
  getMine,
  createBorrow,
  approve,
  rejectBorrow,
  extend,
  markReturned,
  removeBorrow,
} from "../controllers/borrowController.js";
import {
  authRequired,
  authOptional,
  admin,
} from "../middlewares/authMiddleware.js";

const router = express.Router();
/**
 * ROUTES CONFIGURATION
 * ────────────────────────────────────────────
 * Admin:
 *    - GET /api/borrow                 → getAll
 *    - PUT /api/borrow/:id/approve     → approve
 *    - DELETE /api/borrow/:id          → removeBorrow
 * Student/Admin:
 *    - GET /api/borrow/user/:userId    → getByUser
 *    - GET /api/borrow/me              → getMine
 *    - POST /api/borrow                → createBorrow
 *    - PUT /api/borrow/:id/extend      → extend
 *    - PUT /api/borrow/:id/return      → markReturned
 *    - POST /api/borrow/sync           → syncAll (no-op)
 */

router.use(authOptional);

/**
 * @swagger
 * tags:
 *   name: Borrow
 *   description: Borrowing workflow for students and admins
 */

/**
 * @swagger
 * /api/borrow:
 *   get:
 *     summary: (Admin) Lấy danh sách tất cả phiếu mượn
 *     tags: [Borrow]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách phiếu mượn
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Not Admin)
 *   post:
 *     summary: (Student) Tạo yêu cầu mượn sách mới
 *     tags: [Borrow]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - bookId
 *             properties:
 *               userId:
 *                 type: string
 *               bookId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo yêu cầu thành công
 *       400:
 *         description: Sách hết hoặc đã mượn quá giới hạn
 */
router.get("/", authRequired, admin, getAll);
router.post("/", authRequired, createBorrow);

/**
 * @swagger
 * /api/borrow/me:
 *   get:
 *     summary: (Student) Xem lịch sử mượn của chính mình
 *     tags: [Borrow]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách mượn của user hiện tại
 */
router.get("/me", authRequired, getMine);

/**
 * @swagger
 * /api/borrow/user/{userId}:
 *   get:
 *     summary: (Admin) Xem lịch sử mượn của user cụ thể
 *     tags: [Borrow]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách mượn của user
 */
router.get("/user/:userId", authRequired, getByUser);

/**
 * @swagger
 * /api/borrow/{id}/approve:
 *   put:
 *     summary: (Admin) Duyệt yêu cầu mượn
 *     tags: [Borrow]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Đã duyệt
 */
router.put("/:id/approve", authRequired, admin, approve);

/**
 * @swagger
 * /api/borrow/{id}/reject:
 *   put:
 *     summary: (Admin) Từ chối yêu cầu mượn
 *     tags: [Borrow]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Đã từ chối
 */
router.put("/:id/reject", authRequired, admin, rejectBorrow);

/**
 * @swagger
 * /api/borrow/{id}/extend:
 *   put:
 *     summary: (Student) Gia hạn sách thêm 7 ngày
 *     tags: [Borrow]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Gia hạn thành công
 */
router.put("/:id/extend", authRequired, extend);

/**
 * @swagger
 * /api/borrow/{id}/return:
 *   put:
 *     summary: (Admin/Student) Đánh dấu đã trả sách
 *     tags: [Borrow]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trả sách thành công
 */
router.put("/:id/return", authRequired, markReturned);

/**
 * @swagger
 * /api/borrow/{id}:
 *   delete:
 *     summary: (Admin) Xóa bản ghi mượn
 *     tags: [Borrow]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Delete successful
 */
router.delete("/:id", authRequired, admin, removeBorrow);

export default router;