const db = require("../models")
const User = db.User
const bcrypt = require("bcrypt")
const userDataController = {
  getAllUser: async (req, res) => {
    try {
      const findUser = await User.findAll({
        where: {
          is_verify: true,
          RoleId: 1,
        },
        include: [{ model: db.Role }, { model: db.Address }, ,],
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
  getAllWarehouseAdmin: async (req, res) => {
    try {
      const findUser = await User.findAll({
        where: {
          RoleId: 2,
        },
        include: [
          { model: db.Role },
          { model: db.Address },
          { model: db.Warehouse },
        ],
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
  addNewAdmin: async (req, res) => {
    try {
      const { email, password, phone_number, username } = req.body

      const findEmail = await db.User.findOne({
        where: {
          email: email,
        },
      })

      if (findEmail) {
        return res.status(400).json({
          message: "Email has been used",
        })
      }
      const findPhoneNumber = await db.User.findOne({
        where: {
          phone_number: phone_number,
        },
      })

      if (findPhoneNumber) {
        return res.status(400).json({
          message: "Phone number has been used",
        })
      }

      const hashedPassword = bcrypt.hashSync(password, 5)

      const newUser = await db.User.create({
        email,
        password: hashedPassword,
        username,
        phone_number,

        is_verify: true,
        RoleId: 2,
      })

      return res.status(200).json({
        message: "Admin Registered",
        data: newUser,
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "Server Error",
      })
    }
  },
  updateAdmin: async (req, res) => {
    try {
      if (req.file) {
        req.body.profile_picture = `http://localhost:8000/public/${req.file.filename}`
      }

      const { branch, phone_number, profile_picture, username } = req.body

      const { id } = req.params

      await db.User.update(
        {
          branch,
          phone_number,
          profile_picture,
          username,
        },
        {
          where: {
            id: id,
          },
        }
      )
      const findData = await db.User.findByPk(id)
      return res.status(200).json({
        message: "Admin Edited",
        data: findData,
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "Server Error",
      })
    }
  },
  deleteAdmin: async (req, res) => {
    try {
      const { id } = req.params

      await db.User.destroy({
        where: {
          id: id,
        },
      })

      return res.status(200).json({
        message: "Admin Deleted",
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "Server Error",
      })
    }
  },
  findAllWarehouse: async (req, res) => {
    try {
      const response = await db.Warehouse.findAll()

      return res.status(200).json({
        message: "Find All Warehouse",
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

module.exports = userDataController
