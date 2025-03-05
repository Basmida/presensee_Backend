'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Gurus", "id_kelas", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "Kelas", // Nama tabel yang direferensikan
        key: "id", // Primary key dari tabel Kelas
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn("Gurus", "id_kelas");
  },
};

