import { Router } from "express";
import { body, validationResult } from "express-validator";
import { Subscriber } from "../models/Subscriber.js";

const router = Router();

router.post(
  "/",
  body("email").isEmail(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: "Email tidak valid" });

    const { email } = req.body;

    const existing = await Subscriber.findOne({ where: { email } });
    if (existing) return res.status(200).json({ ok: true, message: "Email sudah terdaftar" });

    await Subscriber.create({ email });
    res.json({ ok: true, message: "Berhasil daftar promo!" });
  }
);

export default router;
