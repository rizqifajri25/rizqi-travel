"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Promos", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      terms: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      validFrom: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },

      validTo: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },

      ctaText: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "Klaim Promo via WhatsApp",
      },

      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addIndex("Promos", ["isActive"], { name: "promos_is_active_idx" });
    await queryInterface.addIndex("Promos", ["createdAt"], { name: "promos_created_at_idx" });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Promos");
  },
};
