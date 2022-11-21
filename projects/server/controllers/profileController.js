const db = require("../models")
const { Op } = require("sequelize")

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
