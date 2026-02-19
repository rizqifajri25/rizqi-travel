import { Router } from "express";
import { Package } from "../models/Package.js";
import { requireAuth, requireAdmin } from "../middlewares/auth.js";

const router = Router();

// PUBLIC: list active
router.get("/", async (req, res) => {
  const packages = await Package.findAll({
    where: { isActive: true },
    order: [["createdAt", "ASC"]],
  });
  res.json({ packages });
});

// ADMIN: list all (active+inactive)
router.get("/admin/all", requireAuth, requireAdmin, async (req, res) => {
  const packages = await Package.findAll({ order: [["createdAt", "ASC"]] });
  res.json({ packages });
});

// ADMIN: create
router.post("/", requireAuth, requireAdmin, async (req, res) => {
  const created = await Package.create(req.body);
  res.json({ package: created });
});

// ADMIN: edit
router.put("/:id", requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const pkg = await Package.findByPk(id);
  if (!pkg) return res.status(404).json({ message: "Not found" });

  await pkg.update(req.body);
  res.json({ package: pkg });
});

// ADMIN: toggle active (nonaktifkan/aktifkan)
router.patch("/:id/toggle", requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const pkg = await Package.findByPk(id);
  if (!pkg) return res.status(404).json({ message: "Not found" });

  pkg.isActive = !pkg.isActive;
  await pkg.save();

  res.json({ package: pkg });
});

export default router;
