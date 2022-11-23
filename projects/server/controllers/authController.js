const db = require("../models")
const bcrypt = require("bcrypt")
const { signToken } = require("../lib/jwt")
const fs = require("fs")
const handlebars = require("handlebars")
const emailer = require("../Lib/emailer")

const User = db.User

const authController = {
  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body

      const findUserByEmail = await User.findOne({
        where: {
          email: email,
        },
      })

      if (!findUserByEmail) {
        return res.status(400).json({
          message: "Email not found",
        })
      }

      const passwordValid = bcrypt.compareSync(
        password,
        findUserByEmail.password
      )

      if (!passwordValid) {
        return res.status(400).json({
          message: "password invalid",
        })
      }

      delete findUserByEmail.dataValues.password

      const token = signToken({
        id: findUserByEmail.id,
      })

      return res.status(201).json({
        message: "Login user",
        data: findUserByEmail,
        token: token,
      })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        message: "Server error",
      })
    }
  },
  refreshToken: async (req, res) => {
    try {
      const findUserById = await User.findByPk(req.user.id)

      const renewedToken = signToken({
        id: req.user.id,
      })

      return res.status(200).json({
        message: "Renewed user token",
        data: findUserById,
        token: renewedToken,
      })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        message: "Server error",
      })
    }
  },
  loginWithSocialMedia: async (req, res) => {
    try {
      const { username, email } = req.body

      const findUserByEmail = await User.findOne({
        where: {
          email: email,
        },
      })

      if (!findUserByEmail) {
        if (findUserByEmail) {
          return res.status(400).json({
            message: "Email already registered",
          })
        }

        const findRole = await db.Role.findOne({
          where: {
            id: 1,
          },
        })

        const newUser = await User.create({
          RoleId: findRole.dataValues.id,
          username,
          email,
          is_verify: true,
        })

        const token = signToken({
          id: newUser.id,
        })

        const link = ` http://localhost:3000/`

        const rawHTML = fs.readFileSync("templates/welcome.html", "utf-8")

        const compiledHTML = handlebars.compile(rawHTML)

        const htmlResult = compiledHTML({
          username,
          link,
        })

        await emailer({
          to: email,
          html: htmlResult,
          subject: "Welcome to Shopedia",
          text: "Welcome to Shopedia",
        })

        return res.status(201).json({
          message: "User registered",
          data: newUser,
        })
      }

      const token = signToken({
        id: findUserByEmail.id,
      })

      return res.status(200).json({
        message: "Login User",
        data: findUserByEmail,
        token: token,
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "Server Error",
      })
    }
  },
}

module.exports = {
  authController,
}
