import { DataTypes } from "sequelize";
import { sequelize } from "../lib/db.js";

export const Package = sequelize.define(
  "Package",
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    type: { type: DataTypes.ENUM("TOUR", "HAJI", "UMROH"), allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    price: { type: DataTypes.INTEGER, allowNull: false },
    durationDays: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 10 },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  { timestamps: true }
);
