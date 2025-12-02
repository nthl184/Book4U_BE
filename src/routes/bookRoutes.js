import express from "express";
import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} from "../controllers/bookController.js";
import { authOptional, protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/books:
 * get:
 * summary: Lấy danh sách tất cả sách (Hỗ trợ tìm kiếm)
 * tags: [Books]
 * parameters:
 * - in: query
 * name: keyword
 * schema:
 * type: string
 * description: Tìm theo tên sách hoặc tác giả
 * - in: query
 * name: category
 * schema:
 * type: string
 * description: Lọc theo thể loại
 * responses:
 * 200:
 * description: Thành công
 */
router.get("/", authOptional, getBooks);

/**
 * @swagger
 * /api/books/{id}:
 * get:
 * summary: Xem chi tiết một cuốn sách
 * tags: [Books]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: ID của sách
 * responses:
 * 200:
 * description: Thông tin sách
 * 404:
 * description: Không tìm thấy
 */
router.get("/:id", authOptional, getBookById);

// Các route Admin (Không cần swagger cũng được, hoặc thêm sau)
router.post("/", protect, admin, createBook);
router.put("/:id", protect, admin, updateBook);
router.delete("/:id", protect, admin, deleteBook);

export default router;