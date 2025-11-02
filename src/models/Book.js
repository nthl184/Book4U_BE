import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, index: "text" },
  author: { type: String, required: true, trim: true, index: true },
  category: { type: String, trim: true, index: true },
  isbn: { type: String, unique: true, sparse: true },
  coverUrl: { type: String },
  description: { type: String },
  totalCopies: { type: Number, default: 1, min: 0 },
  availableCopies: { type: Number, default: 1, min: 0 }
}, { timestamps: true });

export default mongoose.model("Book", bookSchema);
