// 📚 crawlBooks.js (Google Books API version - NO OPENAI)
// Thu thập: title, author, image, intro, description, preview

import axios from "axios";
import mongoose from "mongoose";
import Book from "./src/models/bookModel.js";
import dotenv from "dotenv";
dotenv.config();

const GOOGLE_API = "https://www.googleapis.com/books/v1/volumes?q=";

// Danh mục sách để crawl
const categories = [
  "programming",
  "fiction",
  "romance",
  "history",
  "fantasy",
  "science",
  "technology",
];

// Trích nội dung preview tốt nhất có thể
const extractPreview = (info) => {
  return (
    info.description ||
    info.searchInfo?.textSnippet ||
    "No preview available for this book."
  );
};

const crawlCategory = async (keyword) => {
  try {
    console.log(`📚 Crawling category: ${keyword}`);

    const url = `${GOOGLE_API}${encodeURIComponent(keyword)}&maxResults=20`;

    const res = await axios.get(url);
    const items = res.data.items || [];

    let count = 0;

    for (const item of items) {
      const info = item.volumeInfo;
      if (!info?.title) continue;

      const previewText = extractPreview(info);

      const book = {
        title: info.title,
        author: info.authors?.join(", ") || "Unknown",
        category: keyword.toLowerCase(),

        // Hình ảnh
        img: info.imageLinks?.thumbnail || "",
        image: info.imageLinks?.thumbnail || "",

        // Nội dung preview
        intro: previewText.slice(0, 200),
        description: previewText,

        pages: info.pageCount || null,
        fileUrl: info.infoLink || "",
        available: true,
        stock: 10,
        availableCopies: 10,
      };

      await Book.create(book);
      count++;
    }

    console.log(`📥 Added ${count} books for category: ${keyword}`);
    return count;
  } catch (err) {
    console.error("❌ Crawl error:", err.message);
    return 0;
  }
};

// Start
const startCrawling = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("🔗 Connected to MongoDB...");

  let total = 0;

  for (const cate of categories) {
    const added = await crawlCategory(cate);
    total += added;
  }

  console.log("\n==============================");
  console.log(`📚 TOTAL BOOKS ADDED: ${total}`);
  console.log("==============================\n");

  mongoose.connection.close();
  console.log("🔌 MongoDB disconnected");
};

startCrawling();
