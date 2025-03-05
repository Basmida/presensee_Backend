'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Gurus', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      NIP: {
        type: Sequelize.STRING
      },
      Nama: {
        type: Sequelize.STRING
      },
      Email: {
        type: Sequelize.STRING
      },
      Gambar: {
        type: Sequelize.STRING
      },
      Alamat: {
        type: Sequelize.STRING
      },
      Jenis_Kelamin: {
        type: Sequelize.STRING
      },
      Tempat_Lahir: {
        type: Sequelize.STRING
      },
      Tanggal_Lahir: {
        type: Sequelize.DATE
      },
      No_HP: {
        type: Sequelize.STRING
      },
      Password: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Gurus');
  }
};