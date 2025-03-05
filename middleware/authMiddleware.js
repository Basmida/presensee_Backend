const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Akses ditolak! Token tidak tersedia." });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = decoded; // Simpan data user ke req
    next();
  } catch (error) {
    res.status(401).json({ message: "Token tidak valid!" });
  }
};

module.exports = authenticateUser;
