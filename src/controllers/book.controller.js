import Book from "../models/Book.js";

export const listBooks = async (req, res) => {
  const { search = "", category, sort = "createdAt", order = "desc", page = 1, limit = 12 } = req.query;
  const q = {};
  if (search) q.$text = { $search: search };
  if (category) q.category = category;

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Book.countDocuments(q);
  const data = await Book.find(q)
    .sort({ [sort]: order === "desc" ? -1 : 1 })
    .skip(skip)
    .limit(Number(limit));
  res.json({ data, pagination: { total, page: Number(page), limit: Number(limit) } });
};

export const getBook = async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message: "Not found" });
  res.json(book);
};

export const createBook = async (req, res) => {
  const book = await Book.create(req.body);
  res.status(201).json(book);
};

export const updateBook = async (req, res) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!book) return res.status(404).json({ message: "Not found" });
  res.json(book);
};

export const deleteBook = async (req, res) => {
  const book = await Book.findByIdAndDelete(req.params.id);
  if (!book) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Deleted" });
};
