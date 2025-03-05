'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Kelas", "id_guru", {
      type: Sequelize.INTEGER,
      allowNull: true, // Bisa NULL jika kelas belum memiliki wali kelas
      references: {
        model: "Gurus", // Nama tabel yang direferensikan
        key: "id", // Primary key dari tabel Gurus
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn("Kelas", "id_guru");
  },
};

