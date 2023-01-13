const db = require("../models")
const { Op } = require("sequelize")
const bcrypt = require("bcrypt")
const fs = require("fs")
const { async } = require("q")
const { profile } = require("console")

const User = db.User

const userProfileController = {
    getUserProfileById: async (req, res) => {
        try {
            const findUserById = await User.findByPk(req.user.id)

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
            const { username, phone_number } = req.body
            await User.update(
                { username, phone_number },
                { where: { id: req.user.id } }
            )
            const findUserById = await User.findByPk(req.user.id)
            return res.status(200).json({
                message: "Data updated",
                data: findUserById,
            })
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                message: "Server Error",
            })
        }
    },

    editPhotoProfile: async (req, res) => {
        const path = "public/"
        const fileName = await User.findOne({
            where: {
                id: req.params.id,
            },
        })
        try {
            if (req.file) {
                req.body.profile_picture = req.file.filename
            }

            const { profile_picture } = req.body

            if (!fileName.profile_picture === null) {
                await User.update(
                    {
                        profile_picture,
                    },
                    { where: { id: req.user.id } }
                )

                const findUserById = await User.findByPk(req.user.id)
                return res.status(200).json({
                    message: "Data updated",
                    data: findUserById,
                })
            }
            await User.update(
                {
                    profile_picture,
                },
                { where: { id: req.user.id } }
            )
            // fs.unlinkSync(path + fileName.profile_picture)
            const findUserById = await User.findByPk(req.user.id)
            return res.status(200).json({
                message: "Data updated",
                data: findUserById,
            })
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                message: "Server Error",
            })
        }
    },

    passwordEdit: async (req, res) => {
        try {
            const { password } = req.body

            const hashedPassword = await bcrypt.hash(password, 5)

            await User.update(
                { password: hashedPassword },
                { where: { id: req.user.id } }
            )
            console.log(password)
            return res.status(200).json({
                message: "Password Updated",
            })
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                message: "Server Error",
            })
        }
    },
}

module.exports = userProfileController
