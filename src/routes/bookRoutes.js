import express from "express";
import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} from "../controllers/bookController.js";
// thêm middleware bảo vệ
import { authOptional, protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 1. Các route xem sách (GET) -> Ai xem cũng được (authOptional để lấy info nếu có login)
router.get("/", authOptional, getBooks);
router.get("/:id", authOptional, getBookById);

// 2. Các route thay đổi dữ liệu (POST, PUT, DELETE) -> admin mới được làm
router.post("/", protect, admin, createBook);
router.put("/:id", protect, admin, updateBook);
router.delete("/:id", protect, admin, deleteBook);

export default router;