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

// Optional route (cho phép truy cập public nếu cần log token)
router.use(authOptional);
/**
 * @swagger
 * tags:
 * name: Borrow
 * description: Quản lý mượn trả sách
 */

/**
 * @swagger
 * /api/borrow:
 * get:
 * summary: (Admin) Lấy danh sách tất cả phiếu mượn
 * tags: [Borrow]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Danh sách phiếu mượn
 * 401:
 * description: Unauthorized
 * 403:
 * description: Forbidden (Not Admin)
 * post:
 * summary: (Student) Tạo yêu cầu mượn sách mới
 * tags: [Borrow]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - userId
 * - bookId
 * properties:
 * userId:
 * type: string
 * bookId:
 * type: string
 * responses:
 * 201:
 * description: Tạo yêu cầu thành công
 * 400:
 * description: Sách hết hoặc đã mượn quá giới hạn
 */

// Admin — xem tất cả borrow
router.get("/", authRequired, admin, getAll);

// Student/Admin — xem borrow của 1 user cụ thể
router.get("/user/:userId", authRequired, getByUser);
/**
 * @swagger
 * /api/borrow/user/{userId}:
 * get:
 * summary: (Admin) Xem lịch sử mượn của user cụ thể
 * tags: [Borrow]
 * parameters:
 * - in: path
 * name: userId
 * required: true
 * schema:
 * type: string
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Danh sách mượn của user
 */

// Student/Admin — xem borrow của chính mình (qua JWT)
router.get("/me", authRequired, getMine);
/**
 * @swagger
 * /api/borrow/me:
 * get:
 * summary: (Student) Xem lịch sử mượn của chính mình
 * tags: [Borrow]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Danh sách mượn của user hiện tại
 */

// Student — tạo yêu cầu mượn
router.post("/", authRequired, createBorrow);

// Admin — duyệt yêu cầu mượn
router.put("/:id/approve", authRequired, admin, approve);
/**
 * @swagger
 * /api/borrow/{id}/approve:
 * put:
 * summary: (Admin) Duyệt yêu cầu mượn
 * tags: [Borrow]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Đã duyệt
 */

// Admin — từ chối yêu cầu (NEW)
router.put("/:id/reject", authRequired, admin, rejectBorrow);
/**
 * @swagger
 * /api/borrow/{id}/reject:
 * put:
 * summary: (Admin) Từ chối yêu cầu mượn
 * tags: [Borrow]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Đã từ chối
 */

// Student — gia hạn mượn
router.put("/:id/extend", authRequired, extend);
/**
 * @swagger
 * /api/borrow/{id}/extend:
 * put:
 * summary: (Student) Gia hạn sách thêm 7 ngày
 * tags: [Borrow]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Gia hạn thành công
 */

// Student/Admin — trả sách
router.put("/:id/return", authRequired, markReturned);
/**
 * @swagger
 * /api/borrow/{id}/return:
 * put:
 * summary: (Admin/Student) Đánh dấu đã trả sách
 * tags: [Borrow]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Trả sách thành công
 */

// Admin — xóa bản ghi
router.delete("/:id", authRequired, admin, removeBorrow);
/**
 * @swagger
 * /api/borrow/{id}:
 * delete:
 * summary: (Admin) Xóa bản ghi mượn
 * tags: [Borrow]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Đã xóa
 */

export default router;
