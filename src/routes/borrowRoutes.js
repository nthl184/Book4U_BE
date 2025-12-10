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
 *     tags: [Borrow]
 *     summary: Get all borrow records (Admin)
 *     description: Return normalized list of all borrow records for admin view.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: List of borrow records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/BorrowAdminView"
 *   post:
 *     tags: [Borrow]
 *     summary: Create a borrow request (Student)
 *     description: |
 *       Create a new borrow request with status `Pending Approval`.
 *       Enforces max 3 active borrowings per student and checks book availability.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/BorrowCreateRequest"
 *     responses:
 *       "201":
 *         description: Borrow request created, returned in admin view format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BorrowAdminView"
 *       "400":
 *         description: Invalid user/book or limit exceeded / out of stock
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.get("/", authRequired, admin, getAll);
router.post("/", authRequired, createBorrow);

/**
 * @swagger
 * /api/borrow/me:
 *   get:
 *     tags: [Borrow]
 *     summary: Get current student's borrow history
 *     description: Returns only borrow records of the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: List of borrow records for current user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/BorrowStudentView"
 */
router.get("/me", authRequired, getMine);

/**
 * @swagger
 * /api/borrow/user/{userId}:
 *   get:
 *     tags: [Borrow]
 *     summary: Get borrow records of a specific user (Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: List of borrow records for the given user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/BorrowStudentView"
 */
router.get("/user/:userId", authRequired, getByUser);

/**
 * @swagger
 * /api/borrow/{id}/approve:
 *   put:
 *     tags: [Borrow]
 *     summary: Approve a borrow request (Admin)
 *     description: |
 *       Approve a borrow request with status `Pending Approval`.
 *       Re-checks book availability, decrements stock, and sets status to `Borrowing` with borrow and due dates.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Borrow request approved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BorrowAdminView"
 *       "400":
 *         description: Not pending or out of stock
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       "404":
 *         description: Borrow record not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.put("/:id/approve", authRequired, admin, approve);

/**
 * @swagger
 * /api/borrow/{id}/reject:
 *   put:
 *     tags: [Borrow]
 *     summary: Reject a borrow request (Admin)
 *     description: Set status to `Rejected` for a pending borrow request.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Borrow request rejected
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BorrowAdminView"
 *       "400":
 *         description: Only pending requests can be rejected
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       "404":
 *         description: Borrow record not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.put("/:id/reject", authRequired, admin, rejectBorrow);

/**
 * @swagger
 * /api/borrow/{id}/extend:
 *   put:
 *     tags: [Borrow]
 *     summary: Extend borrow due date
 *     description: |
 *       Extend the due date by 7 days.
 *       Allowed when status is `Borrowing` or `Overdue`.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Borrow record extended
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BorrowAdminView"
 *       "400":
 *         description: Only borrowing/overdue records can be extended
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       "404":
 *         description: Borrow record not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.put("/:id/extend", authRequired, extend);

/**
 * @swagger
 * /api/borrow/{id}/return:
 *   put:
 *     tags: [Borrow]
 *     summary: Mark a borrow as returned
 *     description: |
 *       Mark a borrow record as `Returned` and increase book availability again (not exceeding original stock).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Borrow record marked as returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BorrowAdminView"
 *       "400":
 *         description: Already returned or invalid state
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       "404":
 *         description: Borrow record not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.put("/:id/return", authRequired, markReturned);

/**
 * @swagger
 * /api/borrow/{id}:
 *   delete:
 *     tags: [Borrow]
 *     summary: Delete a borrow record (Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Borrow record deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       "404":
 *         description: Borrow record not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.delete("/:id", authRequired, admin, removeBorrow);

export default router;