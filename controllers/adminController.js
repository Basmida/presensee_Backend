const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Admin } = require("../models");

// ✅ Register Admin
exports.register = async (req, res) => {
  try {
    const { nama, email, password } = req.body;
    
    // Cek apakah email sudah digunakan
    const existingAdmin = await Admin.findOne({ where: { email } });
    if (existingAdmin) return res.status(400).json({ message: "Email sudah digunakan" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan admin ke database
    const newAdmin = await Admin.create({ nama, email, password: hashedPassword });

    res.status(201).json({ message: "Admin berhasil didaftarkan", data: newAdmin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Login Admin
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Cari admin berdasarkan email
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) return res.status(404).json({ message: "Admin tidak ditemukan" });

    // Cek password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Password salah" });

    // Buat token
    const token = jwt.sign({ id: admin.id, email: admin.email }, "SECRET_KEY", { expiresIn: "1d" });

    res.json({ message: "Login berhasil", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
