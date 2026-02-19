import { DataTypes } from "sequelize";
import { sequelize } from "../lib/db.js";

export const Promo = sequelize.define(
  "Promo",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    terms: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    validFrom: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    validTo: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    ctaText: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Klaim Promo via WhatsApp",
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "Promos",
  }
);
