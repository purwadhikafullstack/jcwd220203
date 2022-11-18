const db = require("../models")
const bcrypt = require("bcrypt")
const { signToken } = require("../lib/jwt")

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
                    message: "Email not found"
                })
            }

            const passwordValid = bcrypt.compareSync(
                password, findUserByEmail.password
            )

            if (!passwordValid) {
                return res.status(400).json({
                    message: "password invalid"
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
                const newUser = await User.create({
                    username,
                    email,
                    is_verify: true,
                })

                const token = signToken({
                    id: newUser.id,
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
    authController
}