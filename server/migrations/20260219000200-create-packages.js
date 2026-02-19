"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Packages", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      type: {
        type: Sequelize.ENUM("TOUR", "HAJI", "UMROH"),
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

      price: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      durationDays: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 10,
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

    await queryInterface.addIndex("Packages", ["type"], { name: "packages_type_idx" });
    await queryInterface.addIndex("Packages", ["isActive"], { name: "packages_is_active_idx" });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Packages");
    // penting: drop ENUM supaya rollback bersih
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Packages_type";');
  },
};
