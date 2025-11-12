import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, default: "General" },
  img: { type: String, default: "" },        // FE uses 'img'
  image: { type: String, default: "" },      // BookCard.jsx uses 'image' sometimes; mirror to avoid break
  intro: { type: String, default: "" },
  description: { type: String, default: "" },
  stock: { type: Number, default: 1 },
  available: { type: Number, default: 1 },
}, { timestamps: true });

// Ensure FE sees 'id' instead of '_id'
bookSchema.method("toJSON", function () {
  const { __v, _id, ...obj } = this.toObject();
  obj.id = _id.toString();
  // keep image in sync
  if (!obj.image && obj.img) obj.image = obj.img;
  return obj;
});

export default mongoose.model("Book", bookSchema);
