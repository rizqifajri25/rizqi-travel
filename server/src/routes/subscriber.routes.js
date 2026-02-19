import { Router } from "express";
import { Subscriber } from "../models/Subscriber.js";
import { Promo } from "../models/Promo.js";
import { sendPromoEmail } from "../lib/mailer.js";

const router = Router();

router.post("/", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email wajib diisi" });

  try {
    const [sub, created] = await Subscriber.findOrCreate({
      where: { email },
      defaults: { email },
    });

    const promo = await Promo.findOne({
      where: { isActive: true },
      order: [["createdAt", "DESC"]],
    });

    const promoTitle = promo?.title || "Info Promo Rizqi Travel";
    const promoDesc =
      promo?.description ||
      "Terima kasih sudah subscribe! Kami akan kirim info promo terbaru Haji & Umroh.";
    const promoTerms = promo?.terms || "";

    await sendPromoEmail({
      to: email,
      promoTitle,
      promoDesc: promoTerms ? `${promoDesc}<br/><br/><b>S&K:</b><br/>${promoTerms}` : promoDesc,
    });

    return res.json({
      ok: true,
      message: created ? "Berhasil subscribe + email terkirim" : "Email sudah terdaftar, email promo terkirim",
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Gagal subscribe / kirim email" });
  }
});

export default router;
