import { Router } from "express";
import { body, validationResult } from "express-validator";
import { Booking } from "../models/Booking.js";
import { Package } from "../models/Package.js";

const router = Router();

router.post(
  "/",
  body("packageId").isString(),
  body("fullName").isString().isLength({ min: 3 }),
  body("phone").isString().isLength({ min: 8 }),
  body("departureDate").isString(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: "Input tidak valid", errors: errors.array() });

    const { packageId, fullName, phone, departureDate, notes } = req.body;

    const pkg = await Package.findByPk(packageId);
    if (!pkg) return res.status(404).json({ message: "Paket tidak ditemukan" });

    const booking = await Booking.create({
      packageId,
      fullName,
      phone,
      departureDate,
      notes: notes || null,
      status: "pending",
    });

    res.json({ ok: true, booking });
  }
);

export default router;
