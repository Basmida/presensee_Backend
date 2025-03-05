'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Attendances", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      id_guru: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Gurus", // Sesuaikan dengan nama tabel guru
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      waktu_masuk: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      waktu_pulang: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("Hadir", "Tidak Hadir"),
        allowNull: false,
        defaultValue: "Tidak Hadir",
      },
      bukti_gambar: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      keterangan: {
        type: Sequelize.STRING(255),
        allowNull: true,
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
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("Attendances");
  },
};
