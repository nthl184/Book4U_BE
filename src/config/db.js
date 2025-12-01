import mongoose from "mongoose";

import dotenv from "dotenv";
dotenv.config();

async function connectMongoDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB...");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
}

export default connectMongoDB;
