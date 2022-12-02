const db = require("../models")
const bcrypt = require("bcrypt")
const { signToken } = require("../lib/jwt")
const { Op } = require("sequelize")

const { Category, User } = db

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
    adminCreateCategory: async (req, res) => {
        try {
            const { category_name } = req.body

            const findAdminById = await User.findByPk(req.user.id)

            if (findAdminById.RoleId !== 3) {
                return res.status(400).json({
                    message: "User unauthorized"
                })
            }

            const findCategory = await db.Category.findOne({
                where: {
                    category_name,
                }
            })

            if (findCategory) {
                return res.status(400).json({
                    message: "Category name already exist"
                })
            }

            const category_image = `http://localhost:8000/public/${req.file.filename}`

            // console.log(req.file)

            const createNewCategory = await db.Category.create({
                category_name,
                category_image,
            })

            return res.status(201).json({
                message: "Create new category",
                data: createNewCategory
            })

        } catch (err) {
            console.log(err)
            return res.status(500).json({
                message: "Server error"
            })
        }
    },
    adminGetAllCategories: async (req, res) => {
        try {
            const findAdminById = await User.findByPk(req.user.id)

            if (findAdminById.RoleId !== 3) {
                return res.status(400).json({
                    message: "User unauthorized"
                })
            }

            const { category_name = "", _limit = 5, _page = 1, _sortBy = "id", _sortDir = "ASC" } = req.query

            if (_sortBy === "category_name" || _sortBy === "updatedAt" || category_name) {
                const getAllCatagories = await Category.findAndCountAll({
                    limit: Number(_limit),
                    offset: (_page - 1) * _limit,
                    order: [[_sortBy, _sortDir]],
                    where: {
                        category_name: {
                            [Op.like]: `%${category_name}%`
                        }
                    }
                })
                return res.status(200).json({
                    message: 'Get category by name',
                    data: getAllCatagories.rows,
                    dataCount: getAllCatagories.count
                })
            }

            const getAllCatagories = await Category.findAndCountAll({
                limit: Number(_limit),
                offset: (_page - 1) * _limit,
            })
            return res.status(200).json({
                message: 'Get category by name',
                data: getAllCatagories.rows,
                dataCount: getAllCatagories.count
            })
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                message: "Server error"
            })
        }
    },
    adminUpdateCategory: async (req, res) => {
        try {
            const findAdminById = await User.findByPk(req.user.id)

            if (findAdminById.RoleId !== 3) {
                return res.status(400).json({
                    message: "User unauthorized"
                })
            }

            if (req.file) {
                req.body.profile_picture = `http://localhost:8000/public/${req.file.filename}`
            }

            const { id } = req.params

            const { category_name, category_image } = req.body

            const updatedCategory = await Category.update(
                {
                    category_name,
                    category_image,
                },
                {
                    where: {
                        id: id
                    }
                }
            )

            return res.status(200).json({
                message: "Category updated",
                data: updatedCategory
            })

        } catch (err) {
            console.log(err)
            return res.status(500).json({
                message: "Server error"
            })
        }
    },
    adminDeleteCategory: async (req, res) => {
        try {
            const { id } = req.params

            const findAdminById = await User.findByPk(req.user.id)

            if (findAdminById.RoleId !== 3) {
                return res.status(400).json({
                    message: "User unauthorized"
                })
            }

            await Category.destroy({
                where: {
                    id: id
                }
            })

            return res.status(200).json({
                message: "Deleted Category",
            })
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                message: "Server error"
            })
        }
    }
}

module.exports = adminController
