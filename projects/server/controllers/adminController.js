const db = require("../models")
const bcrypt = require("bcrypt")
const { signToken } = require("../lib/jwt")

const User = db.User

const adminController = {
    adminLogin: async (req, res) => {
        try {
            const { email, password } = req.body

            const findUserByEmail = await User.findOne({
                where: {
                    email: email,
                },
            })

            if (findUserByEmail.role == "user") {
                return res.status(400).json({
                    message: "User unauthorized",
                })
            }

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
                message: "Login Admin",
                data: findUserByEmail,
                token: token,
            })
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                message: "Server Error",
            })
        }
    },
}

module.exports = adminController
