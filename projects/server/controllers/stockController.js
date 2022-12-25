const db = require("../models")
const Total_Stock = db.Total_stock
const Warehouse = db.Warehouse
const { Op } = require("sequelize")

const stockController = {
  getAllWarehouse: async (req, res) => {
    try {
      const {
        warehouse_name = "",
        _sortBy = "id",
        _sortDir = "ASC",
        _limit = 6,
        _page = 1,
      } = req.query

      const findAdminById = await db.User.findByPk(req.user.id)

      if (findAdminById.RoleId !== 3) {
        return res.status(400).json({
          message: "User unauthorized",
        })
      }

      if (
        _sortBy === "warehouse_name" ||
        _sortBy === "createdAt" ||
        warehouse_name
      ) {
        const response = await db.Warehouse.findAndCountAll({
          limit: Number(_limit),
          offset: (_page - 1) * _limit,
          order: [[_sortBy, _sortDir]],
          include: [{ model: db.User }],
          where: {
            warehouse_name: {
              [Op.like]: `%${warehouse_name}%`,
            },
          },
        })

        return res.status(200).json({
          message: "Find Warehouse By Name",
          data: response.rows,
          dataCount: response.count,
        })
      }

      const response = await db.Warehouse.findAndCountAll({
        limit: Number(_limit),
        offset: (_page - 1) * _limit,
        order: [[_sortBy, _sortDir]],
        include: [{ model: db.User }],
      })

      return res.status(200).json({
        message: "Find All Warehouse",
        data: response.rows,
        dataCount: response.count,
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "Server Error",
      })
    }
  },
  getAllStockProductByWarehouse: async (req, res) => {
    try {
      const {
        product_name = "",
        CategoryId = "",
        _sortBy = "id",
        _sortDir = "ASC",
        _limit = 6,
        _page = 1,
      } = req.query
      const { id } = req.params

      const findAdminById = await db.User.findByPk(req.user.id)

      if (findAdminById.RoleId !== 3 && findAdminById.RoleId !== 2) {
        return res.status(400).json({
          message: "User unauthorized",
        })
      }

      if (
        _sortBy === "product_name" ||
        _sortBy === "CategoryId" ||
        _sortBy === "createdAt" ||
        product_name ||
        CategoryId
      ) {
        if (!Number(CategoryId)) {
          const response = await db.Total_Stock.findAndCountAll({
            limit: Number(_limit),
            offset: (_page - 1) * _limit,
            subQuery: false,
            include: [
              {
                model: db.Product,
                include: [{ model: db.Category }, { model: db.Image_Url }],
                where: {
                  product_name: {
                    [Op.like]: `%${product_name}%`,
                  },
                },
              },
            ],
            order: [[{ model: db.Product }, _sortBy, _sortDir]],
            where: {
              WarehouseId: id,
            },
          })

          return res.status(200).json({
            message: "Find All Product Stock",
            data: response.rows,
            dataCount: response.count,
          })
        }
        const response = await db.Total_Stock.findAndCountAll({
          limit: Number(_limit),
          offset: (_page - 1) * _limit,
          subQuery: false,
          include: [
            {
              model: db.Product,
              include: [{ model: db.Category }, { model: db.Image_Url }],
              where: {
                product_name: {
                  [Op.like]: `%${product_name}%`,
                },
                CategoryId,
              },
            },
          ],
          order: [[{ model: db.Product }, _sortBy, _sortDir]],
          where: {
            WarehouseId: id,
          },
        })

        return res.status(200).json({
          message: "Find All Product Stock",
          data: response.rows,
          dataCount: response.count,
        })
      }

      const response = await db.Total_Stock.findAndCountAll({
        limit: Number(_limit),
        offset: (_page - 1) * _limit,
        subQuery: false,
        order: [[_sortBy, _sortDir]],
        include: [
          {
            model: db.Product,
            include: [{ model: db.Category }, { model: db.Image_Url }],
          },
        ],
        where: {
          WarehouseId: id,
        },
      })

      return res.status(200).json({
        message: "Find All Product Stock",
        data: response.rows,
        dataCount: response.count,
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "Server Error",
      })
    }
  },
  editProductStock: async (req, res) => {
    try {
      const { id } = req.params
      const { stock } = req.body
      const findAdminById = await db.User.findByPk(req.user.id)

      if (findAdminById.RoleId !== 3 && findAdminById.RoleId !== 2) {
        return res.status(400).json({
          message: "User unauthorized",
        })
      }

      const findBeforeStock = await db.Total_Stock.findByPk(id)

      await db.Total_Stock.update(
        {
          stock,
        },
        {
          where: {
            id: id,
          },
          include: [{ model: db.Product }],
        }
      )

      const findData = await db.Total_Stock.findByPk(id)
      const stock_before = findBeforeStock.dataValues.stock
      const stock_after = findData.dataValues.stock

      const addOrAdd = (stock_before, stock_after) => {
        const count = Math.max(stock_before, stock_after)
        if (count === stock_before) {
          return false
        } else {
          return true
        }
      }

      const journal = await db.Type_Journal.create({
        name: "Update Stock",
        type: addOrAdd(stock_before, stock_after),
        stock_after: findData.dataValues.stock,
        ProductId: findData.ProductId,
      })

      const findTypeId = await db.Type_Journal.findByPk(journal.id)

      await db.Journal.create({
        stock_before: findBeforeStock.dataValues.stock,
        stock_after: findData.dataValues.stock,
        ProductId: findData.ProductId,
        TypeJournalId: findTypeId.dataValues.id,
      })

      return res.status(200).json({
        message: "Stock Updated",
        data: findData,
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "Server Error",
      })
    }
  },
  deleteStock: async (req, res) => {
    try {
      const { id } = req.params

      const findAdminById = await db.User.findByPk(req.user.id)

      if (findAdminById.RoleId !== 3 && findAdminById.RoleId !== 2) {
        return res.status(400).json({
          message: "User unauthorized",
        })
      }

      const findBeforeStock = await db.Total_Stock.findByPk(id)

      await db.Total_Stock.update(
        {
          stock: 0,
        },
        {
          where: {
            id: id,
          },
        }
      )

      const findData = await db.Total_Stock.findByPk(id)
      const stock_before = findBeforeStock.dataValues.stock
      const stock_after = findData.dataValues.stock

      const addOrAdd = (stock_before, stock_after) => {
        const count = Math.max(stock_before, stock_after)
        if (count === stock_before) {
          return false
        } else {
          return true
        }
      }

      const journal = await db.Type_Journal.create({
        name: "Delete Stock",
        type: addOrAdd(stock_before, stock_after),
        stock_after: findData.dataValues.stock,
        ProductId: findData.ProductId,
      })

      const findTypeId = await db.Type_Journal.findByPk(journal.id)

      await db.Journal.create({
        stock_before: findBeforeStock.dataValues.stock,
        stock_after: findData.dataValues.stock,
        ProductId: findData.ProductId,
        TypeJournalId: findTypeId.dataValues.id,
      })

      return res.status(200).json({
        message: "Stock Deleted",
        data: findData,
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "Server Error",
      })
    }
  },
  getAllCategory: async (req, res) => {
    try {
      const response = await db.Category.findAll()

      return res.status(200).json({
        message: "Find All Category",
        data: response,
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "Server Error",
      })
    }
  },
}

module.exports = stockController
