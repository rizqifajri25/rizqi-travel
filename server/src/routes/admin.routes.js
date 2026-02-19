import { Router } from "express";
import { requireAuth, requireAdmin } from "../middlewares/auth.js";
import { Booking } from "../models/Booking.js";
import { Package } from "../models/Package.js";
import { Subscriber } from "../models/Subscriber.js";

const router = Router();

// ADMIN: list bookings
router.get("/bookings", requireAuth, requireAdmin, async (req, res) => {
  const bookings = await Booking.findAll({
    include: [{ model: Package }],
    order: [["createdAt", "DESC"]],
  });
  res.json({ bookings });
});

// ADMIN: list subscribers
router.get("/subscribers", requireAuth, requireAdmin, async (req, res) => {
  const subscribers = await Subscriber.findAll({ order: [["createdAt", "DESC"]] });
  res.json({ subscribers });
});

export default router;
