"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Kelas extends Model {
    static associate(models) {
      // One-to-One dengan Guru, jika kelas memiliki wali kelas
      this.belongsTo(models.Guru, {
        foreignKey: "id_guru",
        as: "wali_kelas",
      });
    }
  }

  Kelas.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nama_kelas: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      id_guru: {
        type: DataTypes.INTEGER,
        allowNull: true, // Bisa NULL jika belum ada wali kelas
        references: {
          model: "Gurus",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
    },
    {
      sequelize,
      modelName: "Kelas",
      tableName: "Kelas",
    }
  );

  return Kelas;
};
