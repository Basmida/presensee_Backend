"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    static associate(models) {
      Attendance.belongsTo(models.Guru, { foreignKey: "id_guru" });
    }
  }

  Attendance.init(
    {
      id_guru: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "gurus", // Ubah ke lowercase karena MySQL case-sensitive
          key: "id",
        },
      },
      waktu_masuk: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      waktu_pulang: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("Hadir", "Tidak Hadir"),
        allowNull: false,
        defaultValue: "Tidak Hadir",
      },
      bukti_gambar: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      keterangan: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Attendance",
      tableName: "attendances", // Sesuaikan dengan nama tabel di database
      timestamps: true,
    }
  );

  return Attendance;
};
