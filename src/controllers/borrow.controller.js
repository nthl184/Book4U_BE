import Borrow from "../models/Borrow.js";
import Book from "../models/Book.js";

const MAX_ACTIVE_BORROWS = Number(process.env.MAX_ACTIVE_BORROWS || 3);
const BORROW_DAYS = Number(process.env.BORROW_DAYS || 14);
const EXTEND_DAYS = Number(process.env.EXTEND_DAYS || 7);
const MAX_EXTENSIONS = Number(process.env.MAX_EXTENSIONS || 1);

export const listAll = async (req, res) => {
  const { status, user, book } = req.query;
  const q = {};
  if (status) q.status = status;
  if (user) q.user = user;
  if (book) q.book = book;
  const data = await Borrow.find(q).populate("user", "name email").populate("book", "title author");
  res.json(data);
};

export const listByUser = async (req, res) => {
  const { userId } = req.params;
  if (String(req.user._id) !== userId && req.user.role !== "admin")
    return res.status(403).json({ message: "Forbidden" });
  const rows = await Borrow.find({ user: userId }).populate("book", "title author");
  res.json(rows);
};

export const createRequest = async (req, res) => {
  const userId = req.user._id;
  const { bookId } = req.body;
  const book = await Book.findById(bookId);
  if (!book) return res.status(404).json({ message: "Book not found" });

  const active = await Borrow.countDocuments({
    user: userId,
    status: { $in: ["pending", "approved", "borrowed"] },
  });
  if (active >= MAX_ACTIVE_BORROWS)
    return res.status(400).json({ message: "You reached max active borrows" });

  const doc = await Borrow.create({ user: userId, book: bookId, status: "pending" });
  res.status(201).json(doc);
};

export const approve = async (req, res) => {
  const br = await Borrow.findById(req.params.id).populate("book");
  if (!br) return res.status(404).json({ message: "Not found" });
  if (!["pending", "rejected"].includes(br.status))
    return res.status(400).json({ message: "Cannot approve this status" });

  if (br.book.availableCopies <= 0) return res.status(400).json({ message: "No copies available" });

  br.status = "borrowed";
  br.approveDate = new Date();
  br.borrowDate = new Date();
  br.dueDate = new Date(Date.now() + BORROW_DAYS * 24 * 3600 * 1000);
  await br.save();

  br.book.availableCopies -= 1;
  await br.book.save();

  res.json(br);
};

export const extend = async (req, res) => {
  const br = await Borrow.findById(req.params.id);
  if (!br) return res.status(404).json({ message: "Not found" });
  if (String(br.user) !== String(req.user._id) && req.user.role !== "admin")
    return res.status(403).json({ message: "Forbidden" });
  if (br.status !== "borrowed") return res.status(400).json({ message: "Not borrowed" });
  if (br.extensions >= MAX_EXTENSIONS) return res.status(400).json({ message: "Max extensions reached" });

  br.extensions += 1;
  br.dueDate = new Date(br.dueDate.getTime() + EXTEND_DAYS * 24 * 3600 * 1000);
  await br.save();
  res.json(br);
};

export const returnBook = async (req, res) => {
  const br = await Borrow.findById(req.params.id).populate("book");
  if (!br) return res.status(404).json({ message: "Not found" });
  if (String(br.user) !== String(req.user._id) && req.user.role !== "admin")
    return res.status(403).json({ message: "Forbidden" });
  if (!["borrowed", "overdue"].includes(br.status))
    return res.status(400).json({ message: "Not borrowed" });

  br.returnDate = new Date();
  if (br.returnDate > br.dueDate) br.status = "overdue";
  else br.status = "returned";

  await br.save();
  br.book.availableCopies += 1;
  await br.book.save();

  res.json(br);
};
