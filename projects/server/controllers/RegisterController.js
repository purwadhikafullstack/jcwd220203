const {
  createVerificationToken,
  validateVerificationToken,
} = require("../Lib/verification")
const db = require("../models")
const User = db.User
const fs = require("fs")
const handlebars = require("handlebars")
const emailer = require("../Lib/emailer")
const { sign } = require("../Lib/verification")
const { signToken, decode } = require("../Lib/jwt")
const bcrypt = require("bcrypt")

const RegisterController = {
  sendEmailRegister: async (req, res) => {
    try {
      const { email } = req.body

      const findUserByEmail = await User.findOne({
        where: {
          email: email,
        },
      })

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
        email,
      })

      const verification_token = signToken({
        id: newUser.id,
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

      return res.status(201).json({
        message: "We has send you an email verification",
        data: newUser,
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "Sever error",
      })
    }
  },
  makePassword: async (req, res) => {
    try {
      const { username, password, token } = req.body

      let decodedToken = decode(token)

      const findUserByEmail = await User.findOne({
        where: {
          id: decodedToken.id,
          is_verify: true,
        },
      })

      if (findUserByEmail) {
        return res.status(400).json({
          message: "User has been verified",
        })
      }

      const hashedPassword = bcrypt.hashSync(password, 5)

      await User.update(
        {
          username,
          password: hashedPassword,
          is_verify: true,
        },
        {
          where: {
            id: decodedToken.id,
          },
        }
      )

      return res.status(201).json({
        message: "User Registered ",
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "Server error",
        console: error,
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

        const link = process.env.BASE_URL_FE

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
        message: "Login Succes",
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

module.exports = { RegisterController }
