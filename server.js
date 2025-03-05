require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const adminRoutes = require("./routes/adminRoutes");
const guruRoutes = require("./routes/guruRoutes");
const attendanceRoutes = require("./routes/attendance");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes admin
app.use("/api/admin", adminRoutes);

//  router Guru
app.use("/api/guru", guruRoutes);

//router absensi
app.use("/api", attendanceRoutes);


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
