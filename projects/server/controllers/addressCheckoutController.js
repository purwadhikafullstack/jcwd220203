const db = require("../models")

const addressCheckoutController = {
  getMainAddress: async (req, res) => {
    try {
      const response = await db.Address.findOne({
        where: {
          UserId: req.user.id,
          is_default: true,
        },
      })

      return res.status(200).json({
        message: "Get Main Address",
        data: response,
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "Server Error",
      })
    }
  },
  getAllAddress: async (req, res) => {
    try {
      const response = await db.Address.findAll({
        where: {
          UserId: req.user.id,
        },
        order: [["is_default", "DESC"]],
      })

      return res.status(200).json({
        message: "Get All Address",
        data: response,
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "Server Error",
      })
    }
  },
}

module.exports = addressCheckoutController
