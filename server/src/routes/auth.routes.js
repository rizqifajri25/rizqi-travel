import { Router } from "express";
import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";
import { User } from "../models/User.js";
import { signToken } from "../lib/jwt.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

// login
router.post(
  "/login",
  body("email").isEmail(),
  body("password").isString().isLength({ min: 3 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: "Invalid input", errors: errors.array() });

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: "Email atau password salah" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Email atau password salah" });

    const token = signToken({ id: user.id, email: user.email, role: user.role, name: user.name });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  }
);

// me
router.get("/me", requireAuth, async (req, res) => {
  res.json({ user: req.user });
});

export default router;
