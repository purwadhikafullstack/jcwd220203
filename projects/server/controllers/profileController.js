const db = require("../models")
const { Op } = require("sequelize")
const fs = require("fs")
const handlebars = require("handlebars")
const emailer = require("../Lib/emailer")
const { signToken } = require("../Lib/jwt")
const bcrypt = require("bcrypt")

const User = db.User

const profileController = {
  getUser: async (req, res) => {
    try {
      const UserData = await User.findAll()
      return res.status(200).json({
        message: "Successfully getting user data!",
        data: UserData,
      })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        message: "Server Error Getting User Data",
      })
    }
  },
  addUser: async (req, res) => {
    try {
      const { username, email, password, phone_number, profile_picture, role } =
        req.body
      const hashedPassword = bcrypt.hashSync(password, 5)
      const newUserData = await User.create({
        username: username,
        email: email,
        password: hashedPassword,
        phone_number: phone_number,
        profile_picture: profile_picture,
        role: role,
      })
      const verification_token = signToken({
        id: newUserData.id,
      })
      const verificationLink = ` ${process.env.BASE_URL_FE}register/verification?verification_token=${verification_token}`
      const rawHTML = fs.readFileSync("templates/verification.html", "utf-8")
      const compiledHTML = handlebars.compile(rawHTML)
      const htmlResult = compiledHTML({
        email,
        verificationLink,
      })

      await emailer({
        to: email,
        html: htmlResult,
        subject: "Activate your account",
        text: "please verify your account",
      })

      return res.status(200).json({
        message: "User data has been created manually!",
        data: newUserData,
      })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        message: "Server Error Creating User",
      })
    }
  },
  deleteUser: async (req, res) => {
    try {
      await User.destroy({
        where: {
          id: req.params.id,
        },
      })
      return res.status(200).json({
        message: "Successfully deleted user!",
      })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        message: "Server Error Deleting User",
      })
    }
  },
  getUserProfileById: async (req, res) => {
    try {
      const { id } = req.params

      const findUserById = await User.findByPk(id)

      return res.status(200).json({
        message: "Get user by id",
        data: findUserById,
      })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        message: "Server Error",
      })
    }
  },

  editUserProfile: async (req, res) => {
    try {
      if (req.file) {
        req.body.profile_picture = `${process.env.REACT_APP_IMAGE_URL}${req.file.filename}`
      }

      const findUserByUser = await User.findOne({
        where: {
          [Op.or]: {
            username: req.body.username || "",
            phone_number: req.body.phone_number || 0,
            password: req.body.password || "",
          },
        },
      })

      if (findUserByUser) {
        return res.status(400).json({
          message: "Username or password same as previous",
        })
      }
      const { id } = req.params
      await User.update({ ...req.body }, { where: { id: id } })
      const findUserById = await User.findByPk(id)

      return res.status(200).json({
        message: "Edited user data",
        data: findUserById,
      })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        message: "Server Error",
      })
    }
  },
}

module.exports = profileController
