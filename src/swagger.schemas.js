/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *       example:
 *         message: "Something went wrong"
 *
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "66f123abcd1234abcd1234aa"
 *         name:
 *           type: string
 *           example: "Nguyen Van A"
 *         email:
 *           type: string
 *           format: email
 *           example: "21520000@gm.uit.edu.vn"
 *         role:
 *           type: string
 *           enum: [student, admin]
 *           example: "student"
 *
 *     AuthLoginRequest:
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
 *
 *     AuthLoginResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: JWT access token
 *         user:
 *           $ref: "#/components/schemas/User"
 *       example:
 *         token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         user:
 *           id: "66f123abcd1234abcd1234aa"
 *           name: "Nguyen Van A"
 *           email: "21520000@gm.uit.edu.vn"
 *           role: "student"
 *
 *     Book:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "66fae3d0b233c0b4c1234567"
 *         title:
 *           type: string
 *           example: "Database System Concepts"
 *         author:
 *           type: string
 *           example: "Silberschatz"
 *         category:
 *           type: string
 *           description: Lowercase category key
 *           example: "database"
 *         coverImage:
 *           type: string
 *           nullable: true
 *           example: "https://example.com/covers/dbsc.jpg"
 *         img:
 *           type: string
 *           nullable: true
 *         image:
 *           type: string
 *           nullable: true
 *         intro:
 *           type: string
 *           nullable: true
 *           example: "An introduction to database systems."
 *         description:
 *           type: string
 *           nullable: true
 *         fileUrl:
 *           type: string
 *           nullable: true
 *           example: "https://example.com/files/dbsc.pdf"
 *         pages:
 *           type: integer
 *           nullable: true
 *           example: 1024
 *         availableCopies:
 *           type: integer
 *           nullable: true
 *           example: 3
 *         stock:
 *           type: integer
 *           nullable: true
 *           description: Total number of copies in stock
 *           example: 5
 *         available:
 *           type: integer
 *           nullable: true
 *           description: Number of copies currently available
 *           example: 3
 *       required:
 *         - id
 *         - title
 *         - author
 *         - category
 *
 *     BookCreateRequest:
 *       type: object
 *       required:
 *         - title
 *         - author
 *       properties:
 *         title:
 *           type: string
 *         author:
 *           type: string
 *         category:
 *           type: string
 *           description: Will be normalized to lowercase on server
 *         coverImage:
 *           type: string
 *           nullable: true
 *         img:
 *           type: string
 *           nullable: true
 *         image:
 *           type: string
 *           nullable: true
 *         intro:
 *           type: string
 *           nullable: true
 *         description:
 *           type: string
 *           nullable: true
 *         fileUrl:
 *           type: string
 *           nullable: true
 *         pages:
 *           type: integer
 *           nullable: true
 *         availableCopies:
 *           type: integer
 *           nullable: true
 *         stock:
 *           type: integer
 *           nullable: true
 *         available:
 *           type: integer
 *           nullable: true
 *
 *     BookUpdateRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         author:
 *           type: string
 *         category:
 *           type: string
 *         coverImage:
 *           type: string
 *           nullable: true
 *         img:
 *           type: string
 *           nullable: true
 *         image:
 *           type: string
 *           nullable: true
 *         intro:
 *           type: string
 *           nullable: true
 *         description:
 *           type: string
 *           nullable: true
 *         fileUrl:
 *           type: string
 *           nullable: true
 *         pages:
 *           type: integer
 *           nullable: true
 *         availableCopies:
 *           type: integer
 *           nullable: true
 *         stock:
 *           type: integer
 *           nullable: true
 *         available:
 *           type: integer
 *           nullable: true
 *
 *     BorrowAdminView:
 *       type: object
 *       description: Normalized borrow record as returned to Admin
 *       properties:
 *         id:
 *           type: string
 *           example: "6700abcd1234ef567890abcd"
 *         title:
 *           type: string
 *           example: "Clean Code"
 *         bookTitle:
 *           type: string
 *           example: "Clean Code"
 *         borrowerName:
 *           type: string
 *           example: "Tran Thi B"
 *         borrowerEmail:
 *           type: string
 *           example: "21520001@gm.uit.edu.vn"
 *         borrowDate:
 *           type: string
 *           format: date
 *           example: "2025-12-01"
 *         dueDate:
 *           type: string
 *           format: date
 *           example: "2025-12-15"
 *         status:
 *           type: string
 *           enum: [Pending Approval, Borrowing, Overdue, Returned, Rejected]
 *           example: "Borrowing"
 *         extendedDays:
 *           type: integer
 *           example: 7
 *
 *     BorrowStudentView:
 *       type: object
 *       description: Normalized borrow record as returned to Student
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         bookTitle:
 *           type: string
 *         borrowDate:
 *           type: string
 *           format: date
 *           example: "2025-12-01"
 *         dueDate:
 *           type: string
 *           format: date
 *           example: "2025-12-15"
 *         status:
 *           type: string
 *           enum: [Pending Approval, Borrowing, Overdue, Returned, Rejected]
 *           example: "Overdue"
 *         daysRemaining:
 *           type: integer
 *           nullable: true
 *           description: Number of days until due date (negative if overdue)
 *           example: -2
 *         extendedDays:
 *           type: integer
 *           example: 7
 *
 *     BorrowCreateRequest:
 *       type: object
 *       required:
 *         - userId
 *         - bookId
 *       properties:
 *         userId:
 *           type: string
 *           example: "66f123abcd1234abcd1234aa"
 *         bookId:
 *           type: string
 *           example: "66fae3d0b233c0b4c1234567"
 */
export {};
