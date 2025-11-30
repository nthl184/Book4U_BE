import asyncHandler from "express-async-handler";
import Book from "../models/bookModel.js";

// =======================
// GET /api/books
// Support search + filter category
// =======================
export const getBooks = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword?.trim();
  const category = req.query.category?.trim();

  const filter = {};

  if (keyword) {
    filter.$or = [
      { title: { $regex: keyword, $options: "i" } },
      { author: { $regex: keyword, $options: "i" } },
    ];
  }

  // FILTER CATEGORY — dùng lowercase đúng chuẩn FE
  if (category && category.toLowerCase() !== "all") {
    filter.category = category.toLowerCase();
  }

  const books = await Book.find(filter).sort({ createdAt: -1 });

  // convert to FE-friendly
  res.json(books.map((b) => b.toJSON()));
});

// =======================
// GET /api/books/:id
// =======================
export const getBookById = asyncHandler(async (req, res) => {
  const b = await Book.findById(req.params.id);
  if (!b) return res.status(404).json({ message: "Book not found" });

  res.json(b.toJSON());
});

// =======================
// POST /api/books (Admin)
// =======================
export const createBook = asyncHandler(async (req, res) => {
  let {
    title,
    author,
    category,
    coverImage,
    img,
    image,
    intro,
    description,
    fileUrl,
    pages,
    availableCopies,
    stock,
    available,
  } = req.body;

  if (!title || !author) {
    return res.status(400).json({ message: "title and author are required" });
  }

  // chuẩn hóa category
  category = category?.trim().toLowerCase() || "others";

  const book = await Book.create({
    title,
    author,
    category,
    coverImage,
    img: img || image || coverImage,
    image: image || img || coverImage,
    intro,
    description,
    fileUrl,
    pages,
    availableCopies,
    stock,
    available,
  });

  res.status(201).json(book.toJSON());
});

// =======================
// PUT /api/books/:id
// =======================
export const updateBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message: "Book not found" });

  const fields = [
    "title",
    "author",
    "category",
    "coverImage",
    "img",
    "image",
    "intro",
    "description",
    "fileUrl",
    "pages",
    "availableCopies",
    "stock",
    "available",
  ];

  fields.forEach((f) => {
    if (req.body[f] !== undefined) {
      if (f === "category") {
        // chuẩn hóa category khi update
        book[f] = req.body[f].trim().toLowerCase();
      } else {
        book[f] = req.body[f];
      }
    }
  });

  // auto-sync ảnh nếu cần
  if (book.coverImage) {
    if (!book.img) book.img = book.coverImage;
    if (!book.image) book.image = book.coverImage;
  }

  const updated = await book.save();
  res.json(updated.toJSON());
});

// =======================
// DELETE /api/books/:id
// =======================
export const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message: "Book not found" });

  await book.deleteOne();
  res.json({ message: "Deleted" });
});