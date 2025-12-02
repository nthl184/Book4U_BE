import asyncHandler from "express-async-handler";
import Borrow from "../models/borrowModel.js";
import Book from "../models/bookModel.js";
import User from "../models/userModel.js";

// Helper tính ngày còn lại
const calcRemaining = (dueDate) => {
  if (!dueDate) return null;
  const diff = Math.ceil(
    (new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24)
  );
  return diff;
};

// Chuẩn hóa dữ liệu trả về cho Admin
const shapeForAdmin = (rec) => {
  const bookTitle = rec.book?.title || rec.title || rec.bookTitle || "Unknown";
  return {
    id: rec.id,
    title: bookTitle,
    bookTitle: bookTitle,
    borrowerName: rec.user?.name || "Unknown",
    borrowerEmail: rec.user?.email || "Unknown",
    borrowDate: rec.borrowDate ? rec.borrowDate.toISOString().slice(0, 10) : "",
    dueDate: rec.dueDate ? rec.dueDate.toISOString().slice(0, 10) : "",
    status: rec.status,
    extendedDays: rec.extendedDays || 0,
  };
};

// Chuẩn hóa dữ liệu trả về cho Student
const shapeForStudent = (rec) => {
  const remaining = calcRemaining(rec.dueDate);
  const isOverdue = remaining < 0;
  // LẤY ĐÚNG TÊN SÁCH
  const bookTitle = rec.book?.title || rec.title || rec.bookTitle || "Unknown";
  
  return {
    id: rec.id,

    // Trả 2 field để FE nào cũng đọc được
    title: bookTitle,
    bookTitle: bookTitle,

    borrowDate: rec.borrowDate ? rec.borrowDate.toISOString().slice(0, 10) : "",
    dueDate: rec.dueDate ? rec.dueDate.toISOString().slice(0, 10) : "",

    status: isOverdue && rec.status === "Borrowing" ? "Overdue" : rec.status,
    daysRemaining: remaining,
    extendedDays: rec.extendedDays || 0,
  };
};

// GET /api/borrow (Admin)
export const getAll = asyncHandler(async (req, res) => {
  const list = await Borrow.find()
    .populate("book user")
    .sort({ createdAt: -1 });
  res.json(list.map(shapeForAdmin));
});

// GET /api/borrow/me (Student)
export const getMine = asyncHandler(async (req, res) => {
  const list = await Borrow.find({ user: req.user.id })
    .populate("book")
    .sort({ createdAt: -1 });
  res.json(list.map(shapeForStudent));
});

// GET /api/borrow/user/:userId
export const getByUser = asyncHandler(async (req, res) => {
  const list = await Borrow.find({ user: req.params.userId })
    .populate("book")
    .sort({ createdAt: -1 });
  res.json(list.map(shapeForStudent));
});

// POST /api/borrow (Tạo yêu cầu mượn)
export const createBorrow = asyncHandler(async (req, res) => {
  const { userId, bookId } = req.body;
  const user = await User.findById(userId);
  const book = await Book.findById(bookId);

  if (!user || !book) return res.status(400).json({ message: "Invalid user or book" });

  // 1. Kiểm tra xem sách còn trong kho không 
  if (book.available < 1) {
    return res.status(400).json({ message: "This book is out of stock, please choose another book." });
  }

  // 2. Giới hạn mỗi sinh viên chỉ mượn tối đa 3 cuốn
  const activeCount = await Borrow.countDocuments({
    user: userId,
    status: { $in: ["Pending Approval", "Borrowing", "Overdue"] },
  });

  if (activeCount >= 3) {
    return res
      .status(400)
      .json({ message: "You have reached the limit of 3 active borrowings." });
  }

  // Create new pending record
  const rec = await Borrow.create({
    user: user._id,
    book: book._id,
    borrower: user.email,
    status: "Pending Approval",
  });

  await rec.populate("book user");
  res.status(201).json(shapeForAdmin(rec));
});

// PUT /api/borrow/:id/approve (Admin Duyệt)
export const approve = asyncHandler(async (req, res) => {
  const rec = await Borrow.findById(req.params.id).populate("book user");
  if (!rec) return res.status(404).json({ message: "Not found" });

  if (rec.status !== "Pending Approval") {
    return res.status(400).json({ message: "Can only approve pending requests." });
  }

  // Khi Admin bấm duyệt, kiểm tra lại lần cuối xem còn sách không
  if (rec.book.available < 1) {
    return res.status(400).json({ message: "This book is out of stock!" });
  }

  // Trừ tồn kho đi 1
  rec.book.available -= 1;
  await rec.book.save(); 

  // Cập nhật trạng thái phiếu mượn
  const now = new Date();
  const due = new Date();
  due.setDate(now.getDate() + 14); // Mượn 14 ngày

  rec.borrowDate = now;
  rec.dueDate = due;
  rec.status = "Borrowing";
  await rec.save();

  res.json(shapeForAdmin(rec));
});

// PUT /api/borrow/:id/reject (Admin Từ chối)
export const rejectBorrow = asyncHandler(async (req, res) => {
  const rec = await Borrow.findById(req.params.id).populate("book user");
  if (!rec) return res.status(404).json({ message: "Not found" });

  if (rec.status !== "Pending Approval") {
    return res.status(400).json({ message: "Only pending requests can be declined." });
  }

  rec.status = "Rejected";
  await rec.save();
  // Từ chối thì không cần cộng trừ kho gì cả vì lúc tạo chưa trừ
  res.json(shapeForAdmin(rec));
});

// PUT /api/borrow/:id/return (Trả sách)
export const markReturned = asyncHandler(async (req, res) => {
  const rec = await Borrow.findById(req.params.id).populate("book user");
  if (!rec) return res.status(404).json({ message: "Not found" });

  if (rec.status === "Returned") {
    return res.status(400).json({ message: "Sách này đã trả rồi." });
  }

  // Sách trả về thì cộng lại vào kho
  rec.book.available += 1;
  
  // Đảm bảo không cộng quá số lượng gốc 
  if (rec.book.available > rec.book.stock) {
     rec.book.available = rec.book.stock;
  }
  
  await rec.book.save();

  rec.status = "Returned";
  await rec.save();

  res.json(shapeForAdmin(rec));
});

// PUT /api/borrow/:id/extend (Gia hạn)
export const extend = asyncHandler(async (req, res) => {
  const rec = await Borrow.findById(req.params.id).populate("book user");
  if (!rec) return res.status(404).json({ message: "Not found" });

  if (rec.status !== "Borrowing" && rec.status !== "Overdue") {
     return res.status(400).json({ message: "Only Borrowing can be extended" });
  }

  const due = new Date(rec.dueDate || new Date());
  due.setDate(due.getDate() + 7);
  rec.dueDate = due;
  rec.extendedDays = (rec.extendedDays || 0) + 7; //gia hạn 7 ngày
  await rec.save();

  res.json(shapeForAdmin(rec));
});

export const removeBorrow = asyncHandler(async (req, res) => {
  const rec = await Borrow.findById(req.params.id);
  if (!rec) return res.status(404).json({ message: "Not found" });
  await rec.deleteOne();
  res.json({ message: "Deleted" });
});

