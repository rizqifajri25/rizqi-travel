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

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
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
