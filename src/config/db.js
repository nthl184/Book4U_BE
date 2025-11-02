import mongoose from "mongoose";

const uri = process.env.MONGO_URI || "mongodb://localhost:27017/book4u";

mongoose
  .connect(uri)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB error:", err);
    process.exit(1);
  });

export default mongoose;
