// controllers/salesController.js
const sequelize = require("../config/database");

exports.createSale = async (req, res) => {
  const { sales_referance, product_code, quantity } = req.body;

  if (!sales_referance || !product_code || !quantity) {
    return res.status(400).json({
      message: "Semua field (referensi, kode produk, kuantitas) harus diisi",
    });
  }

  try {
    await sequelize.query(
      "CALL sp_create_sale(:p_sales_referance, :p_product_code, :p_quantity)",
      {
        replacements: {
          p_sales_referance: sales_referance,
          p_product_code: product_code,
          p_quantity: quantity,
        },
      }
    );

    res.status(201).json({ message: "Transaksi berhasil dicatat" });
  } catch (error) {
    if (error.original && error.original.sqlMessage) {
      if (error.original.sqlMessage.includes("Stok tidak mencukupi")) {
        return res.status(400).json({ message: error.original.sqlMessage });
      }
    }
    res.status(500).json({ message: "Error server", error: error.message });
  }
};
