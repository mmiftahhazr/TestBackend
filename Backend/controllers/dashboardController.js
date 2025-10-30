// controllers/dashboardController.js
const sequelize = require("../config/database");

exports.getTopProducts = async (req, res) => {
  try {
    const results = await sequelize.query("CALL get_top_product()");
    let arrayResult;
    if (Array.isArray(results)) {
      arrayResult = results;
    } else if (results) {
      arrayResult = [results];
    } else {
      arrayResult = [];
    }
    res.status(200).json({ data: arrayResult });
  } catch (error) {
    res.status(500).json({ message: "Error server", error: error.message });
  }
};
