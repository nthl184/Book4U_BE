import asyncHandler from "express-async-handler";
import Book from "../models/bookModel.js";

// GET /api/books
export const getBooks = asyncHandler(async (req, res) => {
  const list = await Book.find().sort({ createdAt: -1 });
  res.json(list.map((b) => b.toJSON()));
});

// GET /api/books/:id
export const getBookById = asyncHandler(async (req, res) => {
  const b = await Book.findById(req.params.id);
  if (!b) return res.status(404).json({ message: "Book not found" });
  res.json(b.toJSON());
});

// POST /api/books
export const createBook = asyncHandler(async (req, res) => {
  const { title, author, category, img, image, intro, description, stock, available } = req.body;
  const book = await Book.create({ title, author, category, img: img || image, image: image || img, intro, description, stock, available });
  res.status(201).json(book.toJSON());
});

// PUT /api/books/:id
export const updateBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message: "Book not found" });
  const fields = ["title","author","category","img","image","intro","description","stock","available"];
  fields.forEach(f => {
    if (req.body[f] !== undefined) book[f] = req.body[f];
  });
  await book.save();
  res.json(book.toJSON());
});

// DELETE /api/books/:id
export const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message: "Book not found" });
  await book.deleteOne();
  res.json({ message: "Deleted" });
});
