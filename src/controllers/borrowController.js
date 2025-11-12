import asyncHandler from "express-async-handler";
import Borrow from "../models/borrowModel.js";
import Book from "../models/bookModel.js";
import User from "../models/userModel.js";

// 🧩 Helper để tính số ngày còn lại
const calcRemaining = (dueDate) => {
  if (!dueDate) return null;
  const diff = Math.ceil(
    (new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24)
  );
  return diff;
};

// 🧩 Chuẩn hóa dữ liệu trả về
const shapeForAdmin = (rec) => ({
  id: rec.id,
  title: rec.book?.title || "",
  borrowerName: rec.user?.name || "",
  borrowerEmail: rec.user?.email || "",
  borrowDate: rec.borrowDate
    ? new Date(rec.borrowDate).toISOString().slice(0, 10)
    : "",
  dueDate: rec.dueDate ? new Date(rec.dueDate).toISOString().slice(0, 10) : "",
  status: rec.status,
  extendedDays: rec.extendedDays || 0,
});

const shapeForStudent = (rec) => {
  const remaining = calcRemaining(rec.dueDate);
  const isOverdue = remaining < 0;
  return {
    id: rec.id,
    title: rec.book?.title || "",
    borrowDate: rec.borrowDate ? rec.borrowDate.toISOString().slice(0, 10) : "",
    dueDate: rec.dueDate ? rec.dueDate.toISOString().slice(0, 10) : "",
    status: isOverdue && rec.status === "Borrowing" ? "Overdue" : rec.status,
    daysRemaining: remaining,
    extendedDays: rec.extendedDays || 0,
  };
};

// 🧾 GET /api/borrow (admin)
export const getAll = asyncHandler(async (req, res) => {
  const list = await Borrow.find()
    .populate("book user")
    .sort({ createdAt: -1 });
  res.json(list.map(shapeForAdmin));
});

// 🧾 GET /api/borrow/me (student)
export const getMine = asyncHandler(async (req, res) => {
  const list = await Borrow.find({ user: req.user.id })
    .populate("book")
    .sort({ createdAt: -1 });
  res.json(list.map(shapeForStudent));
});

// 🧾 GET /api/borrow/user/:id
export const getByUser = asyncHandler(async (req, res) => {
  const list = await Borrow.find({ user: req.params.userId })
    .populate("book")
    .sort({ createdAt: -1 });
  res.json(list.map(shapeForStudent));
});

// 🧾 POST /api/borrow
export const createBorrow = asyncHandler(async (req, res) => {
  const { userId, bookId } = req.body;
  const user = await User.findById(userId);
  const book = await Book.findById(bookId);

  if (!user || !book)
    return res.status(400).json({ message: "Invalid user or book" });

  const rec = await Borrow.create({
    user: user._id,
    book: book._id,
    borrower: user.email,
    status: "Pending Approval",
  });
  await rec.populate("book user");
  res.status(201).json(shapeForAdmin(rec));
});

// 🧾 PUT /api/borrow/:id/approve
export const approve = asyncHandler(async (req, res) => {
  const rec = await Borrow.findById(req.params.id).populate("book user");
  if (!rec) return res.status(404).json({ message: "Not found" });

  const now = new Date();
  const due = new Date();
  due.setDate(now.getDate() + 14);

  rec.borrowDate = now;
  rec.dueDate = due;
  rec.status = "Borrowing";
  await rec.save();

  res.json(shapeForAdmin(rec));
});

// 🧾 PUT /api/borrow/:id/extend
export const extend = asyncHandler(async (req, res) => {
  const rec = await Borrow.findById(req.params.id).populate("book user");
  if (!rec) return res.status(404).json({ message: "Not found" });

  if (rec.status !== "Borrowing")
    return res.status(400).json({ message: "Only Borrowing can be extended" });

  const due = new Date(rec.dueDate || new Date());
  due.setDate(due.getDate() + 7);
  rec.dueDate = due;
  rec.extendedDays = (rec.extendedDays || 0) + 7;
  await rec.save();

  res.json(shapeForAdmin(rec));
});

// 🧾 PUT /api/borrow/:id/return
export const markReturned = asyncHandler(async (req, res) => {
  const rec = await Borrow.findById(req.params.id).populate("book user");
  if (!rec) return res.status(404).json({ message: "Not found" });

  rec.status = "Returned";
  await rec.save();

  res.json(shapeForAdmin(rec));
});

export const removeBorrow = asyncHandler(async (req, res) => {
  const rec = await Borrow.findById(req.params.id);
  if (!rec) return res.status(404).json({ message: "Not found" });
  await rec.deleteOne();
  res.json({ message: "Deleted" });
});

export const syncAll = asyncHandler(async (req, res) => {
  res.json({ message: "Sync OK" });
});
