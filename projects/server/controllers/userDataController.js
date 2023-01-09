const db = require("../models")
const User = db.User
const bcrypt = require("bcrypt")
const { Op } = require("sequelize")
const userDataController = {
  getAllUser: async (req, res) => {
    try {
      const findAdminById = await db.User.findByPk(req.user.id)

      if (findAdminById.RoleId !== 3) {
        return res.status(400).json({
          message: "User unauthorized",
        })
      }

      const {
        username = "",
        _sortBy = "username",
        _sortDir = "ASC",
        _limit = 6,
        _page = 1,
      } = req.query

      if (_sortBy === "username" || _sortBy === "createdAt" || username) {
        const findUser = await db.User.findAndCountAll({
          limit: Number(_limit),
          offset: (_page - 1) * _limit,
          order: [[_sortBy, _sortDir]],
          where: {
            is_verify: 1,
            RoleId: 1,
            username: {
              [Op.like]: `%${username}%`,
            },
          },
          include: [
            { model: db.Role },
            {
              model: db.Address,
            },
          ],
        })
        return res.status(200).json({
          message: "Find User by Name",
          data: findUser.rows,
          dataCount: findUser.count,
        })
      }

      const findUser = await db.User.findAndCountAll({
        limit: Number(_limit),
        offset: (_page - 1) * _limit,
        order: [[_sortBy, _sortDir]],
        where: {
          is_verify: 1,
          RoleId: 1,
          username: {
            [Op.like]: `%${username}%`,
          },
        },
        include: [
          { model: db.Role },
          {
            model: db.Address,
          },
        ],
      })
      return res.status(200).json({
        message: "Find All User Data",
        data: findUser.rows,
        dataCount: findUser.count,
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
      const findAdminById = await db.User.findByPk(req.user.id)

      if (findAdminById.RoleId !== 3) {
        return res.status(400).json({
          message: "User unauthorized",
        })
      }

      const {
        username = "",
        _sortBy = "username",
        _sortDir = "ASC",
        _limit = 6,
        _page = 1,
      } = req.query

      // if (_sortBy === "username" || _sortBy === "createdAt" || username) {
      //   const findUser = await db.User.findAndCountAll({
      //     limit: Number(_limit),
      //     offset: (_page - 1) * _limit,
      //     order: [[_sortBy, _sortDir]],
      //     include: [
      //       { model: db.Role },
      //       {
      //         model: db.Warehouse,
      //         where: {
      //           UserId: "$User.id$",
      //         },
      //       },
      //     ],
      //     where: {
      //       RoleId: 2,
      //       username: {
      //         [Op.like]: `%${username}%`,
      //       },
      //     },
      //   })
      //   return res.status(200).json({
      //     message: "Find Admin by Name",
      //     data: findUser.rows,
      //     dataCount: findUser.count,
      //   })
      // }

      const findUser = await db.User.findAndCountAll({
        offset: (_page - 1) * _limit,
        limit: Number(_limit),
        order: [[_sortBy, _sortDir]],
        include: [
          { model: db.Role },
          {
            model: db.Warehouse,
          },
        ],
        where: {
          RoleId: 2,
        },
      })
      return res.status(200).json({
        message: "Find All Admin Data",
        data: findUser.rows,
        dataCount: findUser.count,
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
      const findAdminById = await db.User.findByPk(req.user.id)

      if (findAdminById.RoleId !== 3) {
        return res.status(400).json({
          message: "User unauthorized",
        })
      }

      const profile_picture = req.file.filename
      const { email, password, phone_number, username, WarehouseId } = req.body

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
        profile_picture,
        phone_number,
        WarehouseId,
        is_verify: true,
        RoleId: 2,
      })

      await db.Warehouse.update(
        {
          UserId: newUser.id,
        },
        {
          where: {
            id: WarehouseId,
          },
        }
      )

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
      const findAdminById = await db.User.findByPk(req.user.id)

      if (findAdminById.RoleId !== 3) {
        return res.status(400).json({
          message: "User unauthorized",
        })
      }

      if (req.file) {
        req.body.profile_picture = req.file.filename
      }

      const { phone_number, profile_picture, username, WarehouseId } = req.body

      const { id } = req.params

      await db.User.update(
        {
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

      await db.Warehouse.update(
        {
          UserId: id,
        },
        {
          where: {
            id: WarehouseId,
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
      const findAdminById = await db.User.findByPk(req.user.id)

      if (findAdminById.RoleId !== 3) {
        return res.status(400).json({
          message: "User unauthorized",
        })
      }

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
      const findAdminById = await db.User.findByPk(req.user.id)

      if (findAdminById.RoleId !== 3) {
        return res.status(400).json({
          message: "User unauthorized",
        })
      }

      const response = await db.Warehouse.findAll({
        where: {
          UserId: null,
        },
      })

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
