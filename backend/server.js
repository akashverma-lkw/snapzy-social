import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";
import { fileURLToPath } from "url";

import aiRoutes from "./routes/ai.route.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import notificationRoutes from "./routes/notification.route.js";

import connectMongoDB from "./db/connectMongoDB.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Trust proxy must be set before cookie-parser & CORS
app.set("trust proxy", 1);

// ✅ Middlewares (in correct order)
app.use(cookieParser());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

// ✅ CORS setup (before routes)
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true, // ✅ JWT cookies ko pass karne ke liye
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Origin",
      "Accept",
      "X-Request-With",
      "Access-Control-Allow-Origin",
    ],
  })
);

// ✅ Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ API Routes (after middlewares)
app.use("/api/ai", aiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);

// ✅ Connect to DB & Start Server
connectMongoDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
  });
