const { Op } = require("sequelize")
const { sequelize } = require("../models")
const db = require("../models")
const Product = db.Product
const Image_Url = db.Image_Url
const Category = db.Category
const Total_Stock = db.Total_Stock

const productController = {
  getProduct: async (req, res) => {
    try {
      const page = parseInt(req.query._page) || 0
      const limit = parseInt(req.query._limit) || 5
      const search = req.query._keywordHandler || ""
      const offset = limit * page
      
      const totalRows = await Product.count({
        where: {
          [Op.or]: [
            { product_name: { [Op.like]: "%" + search + "%" } },
            { description: { [Op.like]: "%" + search + "%" } },
          ],
        },
      });
      
      const totalPage = Math.ceil(totalRows / limit);

      const data = await Product.findAll({
        where: {
          [Op.or]: [
            { product_name: { [Op.like]: "%" + search + "%" } },
            { description: { [Op.like]: "%" + search + "%" } },
          ],
        },
        offset: offset,
        limit: limit,
      });;

      return res.status(200).json({
        message: "Successfully getting product data",
        data: data,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        message: "Failed to get product data",
      });
    }
  },
  
  addProduct: async (req, res) => {
    try {
      const { product_name, description, price } = req.body

      const addProductData = await Product.create({
        product_name,
        description,
        price,
      })
      return res.status(200).json({
        message: "Successfully added product data",
        data: addProductData
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "Error adding product"
      })
    }
  },
  getProductDetail: async (req, res) => {
    try {
      const dataByID = await Product.findOne({
        where: {
          id: req.params.id
        },
        include: [{model: db.Image_Url}]
      });

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
            const { _limit = 5, _page = 1 } = req.query
            const findCategory = await Category.findAll({
                limit: Number(_limit),
                offset: (_page - 1) * _limit,
                order: [["category_name", "ASC"]],
            })
            return res.status(200).json({
                message: "Get category",
                data: findCategory,
                dataCount: findCategory.count,
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
