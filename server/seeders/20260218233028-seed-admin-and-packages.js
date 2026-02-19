"use strict";
const bcrypt = require("bcryptjs");
const { QueryTypes } = require("sequelize");

module.exports = {
  async up(queryInterface) {
    // 1) seed admin (idempotent)
    const existingAdmin = await queryInterface.sequelize.query(
      `SELECT id FROM "Users" WHERE email = :email LIMIT 1`,
      {
        replacements: { email: "admin@rizqitravel.com" },
        type: QueryTypes.SELECT,
      }
    );

    if (existingAdmin.length === 0) {
      const passwordHash = await bcrypt.hash("admin123", 10);

      await queryInterface.bulkInsert("Users", [
        {
          id: require("crypto").randomUUID(),
          name: "Admin Rizqi Travel",
          email: "admin@rizqitravel.com",
          passwordHash,
          role: "admin",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
      console.log("✅ Seed: admin inserted");
    } else {
      console.log("ℹ️ Seed: admin already exists, skip");
    }

    // 2) seed packages (idempotent by title)
    const titles = [
      "Tour Hemat Luar Negeri",
      "Haji Nyaman & Terpercaya",
      "Umroh Premium",
    ];

    const existingPkgs = await queryInterface.sequelize.query(
      `SELECT title FROM "Packages" WHERE title IN (:titles)`,
      {
        replacements: { titles },
        type: QueryTypes.SELECT,
      }
    );

    const existingSet = new Set(existingPkgs.map((x) => x.title));

    const candidates = [
      {
        type: "TOUR",
        title: "Tour Hemat Luar Negeri",
        description:
          "Paket tour nyaman, itinerary rapi, hotel pilihan, dan guide profesional.",
        price: 4500000,
        durationDays: 5,
        isActive: true,
      },
      {
        type: "HAJI",
        title: "Haji Nyaman & Terpercaya",
        description:
          "Bimbingan intensif, akomodasi nyaman, dan pendampingan selama ibadah.",
        price: 125000000,
        durationDays: 40,
        isActive: true,
      },
      {
        type: "UMROH",
        title: "Umroh Premium",
        description:
          "Maskapai & hotel pilihan, jadwal fleksibel, dan pelayanan ramah.",
        price: 32000000,
        durationDays: 12,
        isActive: true,
      },
    ];

    const toInsert = candidates
      .filter((p) => !existingSet.has(p.title))
      .map((p) => ({
        id: require("crypto").randomUUID(),
        ...p,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

    if (toInsert.length > 0) {
      await queryInterface.bulkInsert("Packages", toInsert);
      console.log(`✅ Seed: inserted ${toInsert.length} packages`);
    } else {
      console.log("ℹ️ Seed: packages already exist, skip");
    }

  },

  async down(queryInterface) {
    // optional: hapus yang kita seed
    await queryInterface.bulkDelete("Packages", { title: ["Tour Hemat Luar Negeri", "Haji Nyaman & Terpercaya", "Umroh Premium"] });
    await queryInterface.bulkDelete("Users", { email: "admin@rizqitravel.com" });
  },
};
