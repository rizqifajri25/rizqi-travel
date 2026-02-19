"use strict";
const { QueryTypes } = require("sequelize");

module.exports = {
  async up(queryInterface) {
    // idempotent: kalau sudah ada promo title ini, skip
    const title = "Promo Umroh Hemat Kuota Terbatas";
    const exists = await queryInterface.sequelize.query(
      `SELECT id FROM "Promos" WHERE title = :title LIMIT 1`,
      { replacements: { title }, type: QueryTypes.SELECT }
    );

    if (exists.length) {
      console.log("ℹ️ Seed: promo already exists, skip");
      return;
    }

    await queryInterface.bulkInsert("Promos", [
      {
        id: require("crypto").randomUUID(),
        title,
        description:
          "Diskon biaya paket + bonus perlengkapan (koper, kain ihram/mukena). Berlaku untuk keberangkatan terdekat.",
        terms:
          "Harga dapat berubah mengikuti maskapai/hotel. DP minimal 5 juta. Kuota terbatas. Hubungi admin untuk detail jadwal.",
        validFrom: "2026-02-01",
        validTo: "2026-03-31",
        ctaText: "Klaim Promo via WhatsApp",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    console.log("✅ Seed: promo inserted");
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Promos", { title: "Promo Umroh Hemat Kuota Terbatas" });
  },
};
