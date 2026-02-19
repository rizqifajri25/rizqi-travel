"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Bookings", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      packageId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Packages",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT", // jangan hapus package kalau masih ada booking
      },

      fullName: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      phone: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      departureDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },

      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      status: {
        type: Sequelize.ENUM("pending", "paid", "cancel"),
        allowNull: false,
        defaultValue: "pending",
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

    await queryInterface.addIndex("Bookings", ["packageId"], { name: "bookings_package_id_idx" });
    await queryInterface.addIndex("Bookings", ["status"], { name: "bookings_status_idx" });
    await queryInterface.addIndex("Bookings", ["createdAt"], { name: "bookings_created_at_idx" });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Bookings");
    // penting: drop ENUM supaya rollback bersih
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Bookings_status";');
  },
};
