"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },

      passwordHash: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      role: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "admin",
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

    await queryInterface.addIndex("Users", ["email"], { unique: true, name: "users_email_unique" });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Users");
  },
};
