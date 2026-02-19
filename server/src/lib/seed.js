import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { Package } from "../models/Package.js";
import "../models/Booking.js"; // ensure relations loaded

export async function seedIfEmpty() {
  const userCount = await User.count();
  if (userCount === 0) {
    const passwordHash = await bcrypt.hash("admin123", 10);
    await User.create({
      name: "Admin Rizqi Travel",
      email: "admin@rizqitravel.com",
      passwordHash,
      role: "admin",
    });
    console.log("✅ Seed: admin user created (admin@rizqitravel.com / admin123)");
  }

  const pkgCount = await Package.count();
  if (pkgCount === 0) {
    await Package.bulkCreate([
      {
        type: "TOUR",
        title: "Tour Hemat Luar Negeri",
        description: "Paket tour nyaman, itinerary rapi, hotel pilihan, dan guide profesional.",
        price: 4500000,
        durationDays: 5,
      },
      {
        type: "HAJI",
        title: "Haji Nyaman & Terpercaya",
        description: "Bimbingan intensif, akomodasi nyaman, dan pendampingan selama ibadah.",
        price: 125000000,
        durationDays: 40,
      },
      {
        type: "UMROH",
        title: "Umroh Premium",
        description: "Maskapai & hotel pilihan, jadwal fleksibel, dan pelayanan ramah.",
        price: 32000000,
        durationDays: 12,
      },
    ]);
    console.log("✅ Seed: packages created");
  }
}
