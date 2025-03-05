const express = require("express");
const { registerGuru, loginGuru, updateProfileGuru } = require("../controllers/guruController");

const router = express.Router();

// Admin mendaftarkan akun guru
router.post("/register", registerGuru);

// Guru login
router.post("/login", loginGuru);

// Guru memperbarui profilnya sendiri
router.put("/update/:id", updateProfileGuru);

module.exports = router;
