// controllers/productController.js
const Product = require("../models/product");
const { Op } = require("sequelize");

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ message: "Produk berhasil dibuat", data: product });
  } catch (error) {
    res.status(500).json({ message: "Error server", error: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const { nama, page = 1, limit = 10 } = req.query;

    const parsedLimit = parseInt(limit, 10);
    const parsedPage = parseInt(page, 10);
    const offset = (parsedPage - 1) * parsedLimit;

    let whereCondition = {};
    if (nama) {
      whereCondition.product_name = {
        [Op.like]: `%${nama}%`,
      };
    }

    const { count, rows } = await Product.findAndCountAll({
      where: whereCondition,
      limit: parsedLimit,
      offset: offset,
      order: [["product_name", "ASC"]],
    });

    const totalPages = Math.ceil(count / parsedLimit);

    res.status(200).json({
      data: rows,
      pagination: {
        totalItems: count,
        totalPages: totalPages,
        currentPage: parsedPage,
        itemsPerPage: parsedLimit,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error server", error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }
    res.status(200).json({ data: product });
  } catch (error) {
    res.status(500).json({ message: "Error server", error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    await product.update(req.body);
    res
      .status(200)
      .json({ message: "Produk berhasil diperbarui", data: product });
  } catch (error) {
    res.status(500).json({ message: "Error server", error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(4404).json({ message: "Produk tidak ditemukan" });
    }

    await product.destroy();
    res.status(200).json({ message: "Produk berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Error server", error: error.message });
  }
};
