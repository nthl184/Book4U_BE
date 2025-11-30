import mongoose from "mongoose";
import axios from "axios";
import Book from "./src/models/bookModel.js";

const MONGO_URI = "mongodb://127.0.0.1:27017/book4u"; // đổi nếu dùng Atlas

// List các chủ đề sẽ crawl
const subjects = [
  "programming",
  "fiction",
  "romance",
  "history",
  "fantasy",
  "science",
  "technology",
];

// OpenLibrary API limit
const LIMIT = 20;

async function crawlSubject(subject) {
  const url = `https://openlibrary.org/subjects/${subject}.json?limit=${LIMIT}`;
  const { data } = await axios.get(url);

  const books = data.works.map((item) => ({
    title: item.title,
    author: item.authors?.[0]?.name || "Unknown",
    category: subject,
    description: item.description?.value || item.description || "",
    coverImage: item.cover_id
      ? `https://covers.openlibrary.org/b/id/${item.cover_id}-L.jpg`
      : "",
    fileUrl: item.key ? `https://openlibrary.org${item.key}.pdf` : "",
    pages: item.number_of_pages || 0,
    availableCopies: Math.floor(Math.random() * 5) + 1,
  }));

  return books;
}

async function startCrawl() {
  await mongoose.connect(MONGO_URI);
  console.log("🔗 Connected to MongoDB...");

  let allBooks = [];

  for (const subject of subjects) {
    console.log(`📚 Crawling: ${subject}`);
    const books = await crawlSubject(subject);
    allBooks.push(...books);
  }

  console.log(`📥 Total crawled books: ${allBooks.length}`);

  // clear & insert
  await Book.deleteMany({});
  await Book.insertMany(allBooks);

  console.log("✅ Crawled & Seeded successfully!");
  process.exit();
}

startCrawl().catch((err) => console.error(err));