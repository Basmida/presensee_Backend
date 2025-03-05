const { Attendance, Guru } = require("../models");
const { Op } = require("sequelize");

// Check-in (Memasukkan waktu masuk)
const checkIn = async (req, res) => {
  try {
    const { id_guru } = req.body;

    // Cek apakah guru ada
    const guru = await Guru.findByPk(id_guru);
    if (!guru) {
      return res.status(404).json({ message: "Guru tidak ditemukan" });
    }

    // Cek apakah sudah check-in hari ini
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const existingAttendance = await Attendance.findOne({
      where: {
        id_guru,
        waktu_masuk: {
          [Op.gte]: startOfDay,
          [Op.lt]: endOfDay,
        },
      },
    });

    if (existingAttendance) {
      return res.status(400).json({ message: "Guru sudah check-in hari ini" });
    }

    // Buat data check-in
    const attendance = await Attendance.create({
      id_guru,
      waktu_masuk: new Date(),
      status: "Hadir",
    });

    res.status(201).json({ message: "Check-in berhasil", attendance });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
  }
};

// Check-out (Memasukkan waktu pulang)
const checkOut = async (req, res) => {
  try {
    const { id_guru } = req.body;

    // Cek apakah guru ada
    const attendance = await Attendance.findOne({
      where: {
        id_guru,
        waktu_masuk: { [Op.ne]: null }, // Pastikan sudah check-in
        waktu_pulang: null, // Belum check-out
      },
    });

    if (!attendance) {
      return res.status(400).json({ message: "Guru belum check-in atau sudah check-out" });
    }

    // Update waktu pulang
    attendance.waktu_pulang = new Date();
    await attendance.save();

    res.status(200).json({ message: "Check-out berhasil", attendance });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
  }
};

// Menampilkan riwayat check-in dan check-out berdasarkan userId
const getAttendanceHistory = async (req, res) => {
  try {
    const { userId } = req.query;

    // Cek apakah guru ada
    const guru = await Guru.findByPk(userId);
    if (!guru) {
      return res.status(404).json({ message: "Guru tidak ditemukan" });
    }

    // Ambil semua riwayat kehadiran berdasarkan id_guru
    const attendanceHistory = await Attendance.findAll({
      where: { id_guru: userId },
      order: [["waktu_masuk", "DESC"]],
    });

    res.status(200).json({ message: "Riwayat kehadiran", data: attendanceHistory });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
  }
};

// Menampilkan ringkasan kehadiran berdasarkan filter (tanggal, minggu, atau bulan)
const getAttendanceSummary = async (req, res) => {
  try {
    const { date, week, month, year } = req.query;
    let whereCondition = {};

    if (date) {
      // Filter berdasarkan tanggal tertentu (YYYY-MM-DD)
      const selectedDate = new Date(date);
      const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999));

      whereCondition.waktu_masuk = {
        [Op.gte]: startOfDay,
        [Op.lt]: endOfDay,
      };
    } else if (week && year) {
      // Filter berdasarkan minggu dalam tahun tertentu
      const firstDayOfYear = new Date(year, 0, 1);
      const firstMonday = firstDayOfYear.getDay() === 1 ? firstDayOfYear : new Date(firstDayOfYear.setDate(firstDayOfYear.getDate() + (1 - firstDayOfYear.getDay() + 7) % 7));
      const startOfWeek = new Date(firstMonday.setDate(firstMonday.getDate() + (week - 1) * 7));
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);

      whereCondition.waktu_masuk = {
        [Op.gte]: startOfWeek,
        [Op.lt]: new Date(endOfWeek.setHours(23, 59, 59, 999)),
      };
    } else if (month && year) {
      // Filter berdasarkan bulan dan tahun tertentu
      const startOfMonth = new Date(year, month - 1, 1);
      const endOfMonth = new Date(year, month, 0);

      whereCondition.waktu_masuk = {
        [Op.gte]: new Date(startOfMonth.setHours(0, 0, 0, 0)),
        [Op.lt]: new Date(endOfMonth.setHours(23, 59, 59, 999)),
      };
    } else {
      // Jika tidak ada filter, gunakan data kehadiran hari ini
      const today = new Date();
      const startOfToday = new Date(today.setHours(0, 0, 0, 0));
      const endOfToday = new Date(today.setHours(23, 59, 59, 999));

      whereCondition.waktu_masuk = {
        [Op.gte]: startOfToday,
        [Op.lt]: endOfToday,
      };
    }

    // Hitung jumlah guru yang hadir dan tidak hadir berdasarkan filter
    const hadirCount = await Attendance.count({
      where: { status: "Hadir", ...whereCondition },
    });

    const tidakHadirCount = await Attendance.count({
      where: { status: "Tidak Hadir", ...whereCondition },
    });

    // Ambil daftar guru dengan status kehadiran berdasarkan filter
    const attendanceList = await Attendance.findAll({
      where: whereCondition,
      include: [{ model: Guru, attributes: ["id", "nama"] }],
    });

    res.status(200).json({
      message: "Ringkasan kehadiran",
      filter: { date, week, month, year },
      data: {
        hadir: hadirCount,
        tidakHadir: tidakHadirCount,
        daftarKehadiran: attendanceList,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
  }
};

module.exports = {
  checkIn,
  checkOut,
  getAttendanceHistory,
  getAttendanceSummary,
};
