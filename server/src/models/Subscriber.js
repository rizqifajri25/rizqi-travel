import { DataTypes } from "sequelize";
import { sequelize } from "../lib/db.js";

export const Subscriber = sequelize.define(
  "Subscriber",
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
  },
  { timestamps: true }
);
