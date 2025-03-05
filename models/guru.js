"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Guru extends Model {
    static associate(models) {
      // One-to-One dengan Kelas, jika dia wali kelas
      this.hasOne(models.Kelas, {
        foreignKey: "id_guru",
        as: "kelas",
      });
    }
  }

  Guru.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      NIP: {
        type: DataTypes.STRING(18),
        unique: true,
        allowNull: true,
      },
      Nama: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Email: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false,
      },
      Gambar: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      Alamat: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      Jenis_Kelamin: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      Tempat_Lahir: {
        type: DataTypes.STRING(25),
        allowNull: true,
      },
      Tanggal_Lahir: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      No_HP: {
        type: DataTypes.STRING(13),
        allowNull: true,
      },
      Password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Guru",
      tableName: "Gurus",
    }
  );

  return Guru;
};
