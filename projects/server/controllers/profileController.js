const db = require("../models")
const { Op } = require("sequelize")
const bcrypt = require("bcrypt")

const User = db.User

const profileController = {
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
                req.body.profile_picture = `http://localhost:8000/public/${req.file.filename}`
            }

            const {
                id,
                password,
                username,
                phone_number,
                profile_picture,
                email,
            } = req.body

            const hashedPassword = bcrypt.hashSync(password, 5)
            await User.update(
                {
                    username,
                    password: hashedPassword,
                    email,
                    profile_picture,
                    phone_number,
                },
                { where: { id: req.user.id } }
            )
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
