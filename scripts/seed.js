import "dotenv/config";
import "../src/config/db.js";
import User from "../src/models/User.js";
import Book from "../src/models/Book.js";

await User.deleteMany({});
await Book.deleteMany({});

await User.create([
  { name: "Admin", email: "admin@book4u.edu", password: "admin123", role: "admin" },
  { name: "Student", email: "student@book4u.edu", password: "student123", role: "user" }
]);

await Book.create([
  { title: "Clean Code", author: "Robert C. Martin", category: "Software", totalCopies: 5, availableCopies: 5 },
  { title: "Deep Learning", author: "Ian Goodfellow", category: "AI/ML", totalCopies: 3, availableCopies: 3 }
]);

console.log("Seeded!");
process.exit(0);
