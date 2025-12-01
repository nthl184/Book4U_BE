import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectMongoDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import bookRoutes from "./src/routes/bookRoutes.js";
import borrowRoutes from "./src/routes/borrowRoutes.js";

dotenv.config();
const app = express();

// Core middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

// Health check
app.get("/", (req, res) => res.send("Book4U API is running"));

// API routes (baseURL expected by FE: http://localhost:5000/api)
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/borrow", borrowRoutes);

// Start server
const PORT = process.env.PORT || 5000;

connectMongoDB().then(() => {
  app.listen(PORT, () =>
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
  );
}
);

export default app;
