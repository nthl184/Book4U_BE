import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, default: "General" },

    // Ảnh bìa — data crawl dùng coverImage
    coverImage: { type: String, default: "" },

    // FE cũ dùng img hoặc image
    img: { type: String, default: "" },
    image: { type: String, default: "" },

    description: { type: String, default: "" },
    intro: { type: String, default: "" },

    // PDF
    fileUrl: { type: String, default: "" },

    pages: { type: Number, default: 0 },
    availableCopies: { type: Number, default: 1 },

    stock: { type: Number, default: 1 },
    available: { type: Number, default: 1 },
  },
  { timestamps: true }
);

// Normalize để FE luôn nhận đúng ảnh
bookSchema.method("toJSON", function () {
  const { __v, _id, ...obj } = this.toObject();
  obj.id = _id.toString();

  // FE ưu tiên dùng img / image → nếu không có thì gán coverImage vào
  if (!obj.img && obj.coverImage) obj.img = obj.coverImage;
  if (!obj.image && obj.coverImage) obj.image = obj.coverImage;

  return obj;
});

export default mongoose.model("Book", bookSchema);
