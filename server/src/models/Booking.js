import { DataTypes } from "sequelize";
import { sequelize } from "../lib/db.js";
import { Package } from "./Package.js";

export const Booking = sequelize.define(
  "Booking",
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    packageId: { type: DataTypes.UUID, allowNull: false },
    fullName: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    departureDate: { type: DataTypes.DATEONLY, allowNull: false },
    notes: { type: DataTypes.TEXT, allowNull: true },
    status: { type: DataTypes.ENUM("pending", "paid", "cancel"), defaultValue: "pending" },
  },
  { timestamps: true }
);

// relations
Package.hasMany(Booking, { foreignKey: "packageId" });
Booking.belongsTo(Package, { foreignKey: "packageId" });
