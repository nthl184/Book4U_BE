import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import connectDB from "../src/config/db.js";
import User from "../src/models/userModel.js";
import Book from "../src/models/bookModel.js";

dotenv.config();

const run = async () => {
  await connectDB();

  await User.deleteMany({});
  await Book.deleteMany({});

  const admin = await User.create({
    name: "Admin",
    email: "admin@book4u.com",
    password: await bcrypt.hash("123456", 10),
    role: "admin"
  });

  const student = await User.create({
    name: "Student",
    email: "student@book4u.com",
    password: await bcrypt.hash("123456", 10),
    role: "student"
  });

  const books = await Book.insertMany([
    {
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      category: "Classic",
      img: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
      intro: "A timeless story of love and illusion set in the roaring 1920s.",
      description: "Nick Carraway meets the enigmatic Jay Gatsby...",
      stock: 5, available: 5
    },
    {
      title: "Atomic Habits",
      author: "James Clear",
      category: "Self-Help",
      img: "https://images.unsplash.com/photo-1589820296156-2454bb8fd0ec",
      intro: "Tiny changes, remarkable results.",
      description: "An operating system for building better habits.",
      stock: 8, available: 8
    },
    {
      title: "Clean Code",
      author: "Robert C. Martin",
      category: "Programming",
      img: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4",
      intro: "A handbook of agile software craftsmanship.",
      description: "Principles, patterns, and practices of writing clean code.",
      stock: 3, available: 3
    }
  ]);

  console.log("✅ Seeded:", { users: 2, books: books.length });
  await mongoose.connection.close();
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
