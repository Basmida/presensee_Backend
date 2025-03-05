const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Guru } = require("../models");

// Secret Key untuk JWT
const JWT_SECRET = "your_secret_key"; // Ganti dengan secret key yang aman

// Admin membuat akun guru (hanya email & password)
const registerGuru = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Cek apakah email sudah terdaftar
        const existingGuru = await Guru.findOne({ where: { Email: email } });
        if (existingGuru) {
            return res.status(400).json({ message: "Email sudah terdaftar" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Buat akun guru
        const newGuru = await Guru.create({
            Email: email,
            Password: hashedPassword,
        });

        res.status(201).json({
            message: "Akun Guru berhasil dibuat",
            guru: {
                id: newGuru.id,
                email: newGuru.Email,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
    }
};

// Guru login dengan email & password + JWT
const loginGuru = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Cek apakah email terdaftar
        const guru = await Guru.findOne({ where: { Email: email } });
        if (!guru) {
            return res.status(400).json({ message: "Email tidak ditemukan" });
        }

        // Cek password
        const isMatch = await bcrypt.compare(password, guru.Password);
        if (!isMatch) {
            return res.status(401).json({ message: "Password salah" });
        }

        // Buat token JWT
        const token = jwt.sign(
            { id: guru.id, email: guru.Email }, 
            JWT_SECRET, 
            { expiresIn: "1h" } // Pastikan format benar, contoh: "1h", "24h", "7d"
        );

        res.status(200).json({
            message: "Login berhasil",
            token, // Kirim token ke frontend
            guru: {
                id: guru.id,
                email: guru.Email,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
    }
};

// Guru memperbarui profilnya sendiri
const updateProfileGuru = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            NIP, Nama, Email, Gambar, Alamat, Jenis_Kelamin,
            Tempat_Lahir, Tanggal_Lahir, No_HP, Password
        } = req.body;

        // Cari guru berdasarkan ID
        const guru = await Guru.findByPk(id);
        if (!guru) {
            return res.status(404).json({ message: "Guru tidak ditemukan" });
        }

        // Hash password baru jika diupdate
        let hashedPassword = guru.Password;
        if (Password) {
            hashedPassword = await bcrypt.hash(Password, 10);
        }

        // Update data guru
        await guru.update({
            NIP: NIP || guru.NIP,
            Nama: Nama || guru.Nama,
            Email: Email || guru.Email,
            Gambar: Gambar || guru.Gambar,
            Alamat: Alamat || guru.Alamat,
            Jenis_Kelamin: Jenis_Kelamin || guru.Jenis_Kelamin,
            Tempat_Lahir: Tempat_Lahir || guru.Tempat_Lahir,
            Tanggal_Lahir: Tanggal_Lahir || guru.Tanggal_Lahir,
            No_HP: No_HP || guru.No_HP,
            Password: hashedPassword,
        });

        res.status(200).json({
            message: "Profil berhasil diperbarui",
            guru: {
                id: guru.id,
                NIP: guru.NIP,
                Nama: guru.Nama,
                Email: guru.Email,
                Gambar: guru.Gambar,
                Alamat: guru.Alamat,
                Jenis_Kelamin: guru.Jenis_Kelamin,
                Tempat_Lahir: guru.Tempat_Lahir,
                Tanggal_Lahir: guru.Tanggal_Lahir,
                No_HP: guru.No_HP,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
    }
};

module.exports = { registerGuru, loginGuru, updateProfileGuru };
