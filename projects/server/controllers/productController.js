const { Op } = require("sequelize")
const db = require("../models")
const Product = db.Product
const Image_Url = db.Image_Url
const Category = db.Category
const Total_Stock = db.Total_Stock

const productController = {
    getAllProduct: async (req, res) => {
        try {
            const {
                category_name = "",
                product_name = "",
                CategoryId = "",
                _sortBy = "id",
                _sortDir = "ASC",
                _limit = 12,
                _page = 1,
            } = req.query

            if (CategoryId) {
                if (!Number(CategoryId)) {
                    const getAllProducts1 = await Product.findAndCountAll({
                        limit: Number(_limit),
                        offset: (_page - 1) * _limit,
                        include: [
                            { model: Category, required: true },
                            { model: Image_Url },
                        ],
                        order: [[_sortBy, _sortDir]],
                        where: {
                            [Op.or]: {
                                product_name: {
                                    [Op.like]: `%${product_name}%`,
                                },
                                "$Category.category_name$": {
                                    [Op.like]: `%${category_name}%`,
                                },
                            },
                        },
                    })
                    return res.status(200).json({
                        message: "Get all products",
                        data: getAllProducts1.rows,
                        dataCount: getAllProducts1.count,
                    })
                }

                const getAllProducts2 = await Product.findAndCountAll({
                    limit: Number(_limit),
                    offset: (_page - 1) * _limit,
                    include: [
                        { model: Category, required: true },
                        { model: Image_Url },
                    ],

                    order: [[_sortBy, _sortDir]],
                    where: {
                        [Op.or]: {
                            product_name: {
                                [Op.like]: `%${product_name}%`,
                            },
                            "$Category.category_name$": {
                                [Op.like]: `%${category_name}%`,
                            },
                        },

                        CategoryId,
                    },
                })

                return res.status(200).json({
                    message: "Get all books",
                    data: getAllProducts2.rows,
                    dataCount: getAllProducts2.count,
                })
            }
            const getAllProducts3 = await Product.findAndCountAll({
                limit: Number(_limit),
                offset: (_page - 1) * _limit,
                include: [{ model: Category }, { model: Image_Url }],
                order: [
                    [_sortBy, _sortDir],
                    ["price", "DESC"],
                ],
            })
            return res.status(200).json({
                message: "Get all",
                data: getAllProducts3.rows,
                dataCount: getAllProducts3.count,
            })
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                message: "Server Error",
            })
        }
    },

    getProductById: async (req, res) => {
        try {
            const { id } = req.params
            const findProductByPk = await Product.findByPk(id, {
                include: [
                    { model: Category },
                    { model: Image_Url },
                    { model: Total_Stock },
                ],
            })

            return res.status(200).json({
                message: "Get Products details",
                data: findProductByPk,
            })
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                message: "Server Error",
            })
        }
    },
    getImage: async (req, res) => {
        try {
            const { id } = req.params
            const findImageById = await Image_Url.findByPk(id)

            return res.status(200).json({
                message: "Get image by id",
                data: findImageById,
            })
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                message: "Server Error",
            })
        }
    },

    getCategory: async (req, res) => {
        try {
            const { _limit = 50, _page = 1 } = req.query
            const findCategory = await Category.findAll({
                limit: Number(_limit),
                offset: (_page - 1) * _limit,
                order: [["category_name", "ASC"]],
            })

            const getCategoryId = findCategory.map((val) => val.id)
            const categoryCount = getCategoryId.length
            return res.status(200).json({
                message: "Get category",
                data: findCategory,
                dataCount: findCategory.count,
                categoryCount: categoryCount,
            })
        } catch (err) {
            console.log(err)
            return res.status(200).json({
                message: "Server Error",
            })
        }
    },

    getCategoryId: async (req, res) => {
        try {
            const { id } = req.params
            const findCategoryById = await Category.findByPk(id)
            return res.status(200).json({
                message: "Get category",
                data: findCategoryById,
            })
        } catch (err) {
            console.log(err)
            return res.status(200).json({
                message: "Server Error",
            })
        }
    },
}

module.exports = productController
