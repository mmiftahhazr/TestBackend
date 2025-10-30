// server.js
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");
require("dotenv").config();

// Impor Rute
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const salesController = require("./controllers/salesController");
const dashboardController = require("./controllers/dashboardController");
const authMiddleware = require("./middleware/authMiddleware");

// Impor Model
const Product = require("./models/product");
const User = require("./models/user");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rute
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.get(
  "/api/dashboard/top-products",
  authMiddleware,
  dashboardController.getTopProducts
);
app.post("/api/sales", authMiddleware, salesController.createSale);

// Tes koneksi dan sinkronisasi database
sequelize
  .authenticate()
  .then(() => {
    console.log("Koneksi database berhasil.");
    return sequelize.sync();
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server berjalan di http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Tidak dapat terhubung ke database:", err);
  });
