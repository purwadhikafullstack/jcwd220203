const db = require("../models")
const { Op } = require("sequelize")
const { Category, Product } = db

const categoryController = {
    showAllCategories: async (req, res) => {
        try {
            const { category_name = "", _limit = 50, _sortBy = "id", _sortDir = "ASC", _sortProductBy = "id", _sortProductDir = "ASC", _productLimit = 50 } = req.query

            if (category_name || _sortProductBy === "nama" || _sortProductBy === "harga" || _sortProductBy === "createdAt") {
                const getCategoriesByName = await Category.findAndCountAll({
                    limit: Number(_limit),
                    order: [[_sortBy, _sortDir]],
                    where: {
                        category_name: {
                            [Op.like]: `%${category_name}%`
                        }
                    },
                    include: [{
                        model: db.Product,
                        separate: true,
                        order: [[_sortProductBy, _sortProductDir]],
                        include: [{ model: db.ImageURL }],
                        limit: Number(_productLimit)
                    }],
                })

                return res.status(200).json({
                    message: 'Get category by name',
                    data: getCategoriesByName.rows,
                    dataCount: getCategoriesByName.count
                })
            }

            if (_sortBy === "category_name") {
                const getAllCatagories = await Category.findAndCountAll({
                    limit: Number(_limit),
                    order: [[_sortBy, _sortDir]],
                    include: [{ model: db.Product }],
                })
                return res.status(200).json({
                    message: 'Get All Categories',
                    data: getAllCatagories.rows,
                    dataCount: getAllCatagories.count
                })
            }

            const getAllCatagories = await Category.findAndCountAll({
                limit: Number(_limit),
                include: [{ model: db.Product }],
            })
            return res.status(200).json({
                message: 'Get All Categories',
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
    getCategoryByName: async (req, res) => {
        try {
            const { category_name } = req.query

            const findCategoryByName = await Category.findOne({
                where: {
                    category_name: category_name
                },
                include: [{ model: db.Product }]
            })

            return res.status(200).json({
                message: "Get cetegory by name",
                data: findCategoryByName,
            })

        } catch (err) {
            console.log(err)
            return res.status(500).json({
                message: "server error"
            })
        }
    }
}

module.exports = categoryController