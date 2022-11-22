const db = require("../models")
const User = db.User
const userDataController = {
  getAllUser: async (req, res) => {
    try {
      const findUser = await User.findAll({
        where: {
          is_verify: true,
        },
        // include: [{ model: db.Role }],
      })
      return res.status(200).json({
        message: "Find All User Data",
        data: findUser,
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "Sever Error",
      })
    }
  },
}

module.exports = userDataController
