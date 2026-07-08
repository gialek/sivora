import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import kandidatRoutes from "./routes/kandidat.js";
import votingRoutes from "./routes/voting.js";
import pengaturanRoutes from "./routes/pengaturan.js";
import usersRoutes from "./routes/users.js";
import statistikRoutes from "./routes/statistik.js";
import dashboardRoutes from "./routes/dashboard.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/kandidat", kandidatRoutes);
app.use("/api/voting", votingRoutes);
app.use("/api/pengaturan", pengaturanRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/statistik", statistikRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "SIPEMIRA API berjalan!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server SIPEMIRA berjalan di port ${PORT}`);
});
