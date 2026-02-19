import { Router } from "express";
import { Promo } from "../models/Promo.js";
import { requireAuth, requireAdmin } from "../middlewares/auth.js";

const router = Router();

/** PUBLIC: ambil promo aktif terbaru */
router.get("/active", async (req, res) => {
  const promo = await Promo.findOne({
    where: { isActive: true },
    order: [["createdAt", "DESC"]],
  });

  res.json({ promo: promo || null });
});

/** ADMIN: list semua promo */
router.get("/admin/all", requireAuth, requireAdmin, async (req, res) => {
  const promos = await Promo.findAll({ order: [["createdAt", "DESC"]] });
  res.json({ promos });
});

/** ADMIN: create promo */
router.post("/", requireAuth, requireAdmin, async (req, res) => {
  const created = await Promo.create(req.body);
  res.json({ promo: created });
});

/** ADMIN: update promo */
router.put("/:id", requireAuth, requireAdmin, async (req, res) => {
  const promo = await Promo.findByPk(req.params.id);
  if (!promo) return res.status(404).json({ message: "Promo not found" });

  await promo.update(req.body);
  res.json({ promo });
});

/** ADMIN: toggle active/nonactive */
router.patch("/:id/toggle", requireAuth, requireAdmin, async (req, res) => {
  const promo = await Promo.findByPk(req.params.id);
  if (!promo) return res.status(404).json({ message: "Promo not found" });

  promo.isActive = !promo.isActive;
  await promo.save();

  res.json({ promo });
});

/** ADMIN: delete promo */
router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  const promo = await Promo.findByPk(req.params.id);
  if (!promo) return res.status(404).json({ message: "Promo not found" });

  await promo.destroy();
  res.json({ ok: true });
});

export default router;
