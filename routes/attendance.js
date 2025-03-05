const express = require("express");
const { checkIn, checkOut,getAttendanceHistory, getAttendanceSummary } = require("../controllers/attendanceController");
const router = express.Router();
const authenticateUser = require("../middleware/authMiddleware");

router.post("/attendance/checkin", authenticateUser, checkIn); //Check-in hanya bisa jika sudah login
router.post("/attendance/check-out", authenticateUser, checkOut);
router.get("/attendance/history", getAttendanceHistory); // Riwayat check-in & check-out guru
router.get("/admin/attendance-summary", getAttendanceSummary); // Ringkasan kehadiran admin


module.exports = router;
