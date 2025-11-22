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
  syncAll,
} from "../controllers/borrowController.js";
import {
  authRequired,
  authOptional,
  admin,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * 🧾 ROUTES CONFIGURATION
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

// 🧩 Optional route (cho phép truy cập public nếu cần log token)
router.use(authOptional);

// 🧾 Admin — xem tất cả borrow
router.get("/", authRequired, admin, getAll);

// 🧾 Student/Admin — xem borrow của 1 user cụ thể
router.get("/user/:userId", authRequired, getByUser);

// 🧾 Student/Admin — xem borrow của chính mình (qua JWT)
router.get("/me", authRequired, getMine);

// 🧾 Student — tạo yêu cầu mượn
router.post("/", authRequired, createBorrow);

// 🧾 Admin — duyệt yêu cầu mượn
router.put("/:id/approve", authRequired, admin, approve);

// 🧾 Admin — từ chối yêu cầu (NEW)
router.put("/:id/reject", authRequired, admin, rejectBorrow);

// 🧾 Student — gia hạn mượn
router.put("/:id/extend", authRequired, extend);

// 🧾 Student/Admin — trả sách
router.put("/:id/return", authRequired, markReturned);

// 🧾 Admin — xóa bản ghi
router.delete("/:id", authRequired, admin, removeBorrow);

// 🧾 Common — sync no-op (nút "Sync" trên FE)
router.post("/sync", authRequired, syncAll);

export default router;
