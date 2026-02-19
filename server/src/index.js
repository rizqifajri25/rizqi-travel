import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { sequelize } from "./lib/db.js";
import { seedIfEmpty } from "./lib/seed.js";

import authRoutes from "./routes/auth.routes.js";
import packageRoutes from "./routes/package.routes.js";
import subscriberRoutes from "./routes/subscriber.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import adminRoutes from "./routes/admin.routes.js";

dotenv.config();

const app = express();

const allowedOrigins = (process.env.CLIENT_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

// (opsional) domain prod kamu (kalau sudah fix)
const PROD_ORIGIN = "https://rizqi-travel.vercel.app";

app.use(
  cors({
    origin(origin, cb) {
      // allow requests without origin (curl/postman/server-to-server)
      if (!origin) return cb(null, true);

      // allow localhost dev
      if (origin === "http://localhost:5173") return cb(null, true);

      // allow prod domain
      if (origin === PROD_ORIGIN) return cb(null, true);

      // allow any origins explicitly listed in env
      if (allowedOrigins.includes(origin)) return cb(null, true);

      // ✅ allow Vercel preview domains (biar gak perlu update env tiap deploy)
      // contoh: https://rizqi-travel-xxxxx-rizqifajri25s-projects.vercel.app
      if (origin.endsWith(".vercel.app")) return cb(null, true);

      return cb(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use("/api/admin", adminRoutes);

app.get("/api/health", (req, res) => res.json({ ok: true, name: "Rizqi Travel API" }));

app.use("/api/auth", authRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/subscribers", subscriberRoutes);
app.use("/api/bookings", bookingRoutes);

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await sequelize.authenticate();

    app.listen(PORT, () => {
      console.log(`✅ API running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

start();
