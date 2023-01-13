const db = require("../models")
const { Op } = require("sequelize")
const { sequelize } = require("../models")

const Transaction = db.Transaction
const TransactionItem = db.TransactionItem
const Warehouse = db.Warehouse
const Product = db.Product
const Total_Stock = db.Total_Stock
const User = db.User
const Image_Url = db.Image_Url

const adminOrderHistoryController = {
    getAllOrderHistory: async (req, res) => {
        const WarehouseId = req.query.WarehouseId[0]
        const {
            createdAt,
            transaction_name = "",
            _limit = 10,
            _page = 1,
            _sortBy = "id",
            _sortDir = "DESC",
        } = req.query
        try {
            let sql = `SELECT  trx.id AS TransactionId,  trx.WarehouseId, wr.warehouse_name, trx.createdAt
                        FROM transactionitems AS trx_items
                        JOIN products AS pr ON pr.id = trx_items.ProductId
                        JOIN transactions AS trx ON trx.id = trx_items.TransactionId
                        JOIN warehouses as wr ON wr.id = trx.WarehouseId `

            if (WarehouseId && createdAt && transaction_name) {
                sql += `WHERE WarehouseId=${WarehouseId} AND MONTH(trx.createdAt)=${createdAt} AND trx.transaction_name LIKE "%${transaction_name}%" `
            } else if (WarehouseId && transaction_name) {
                sql += `WHERE WarehouseId=${WarehouseId} AND trx.transaction_name LIKE "%${transaction_name}%"  `
            } else if (WarehouseId && createdAt) {
                sql += `WHERE WarehouseId=${WarehouseId} AND MONTH(trx.createdAt)=${createdAt} `
            } else if (createdAt && transaction_name) {
                sql += `WHERE MONTH(trx.createdAt)=${createdAt} AND trx.transaction_name LIKE "%${transaction_name}%" `
            } else if (WarehouseId) {
                sql += `WHERE WarehouseId=${WarehouseId} `
            } else if (createdAt) {
                sql += `WHERE MONTH(trx.createdAt)=${createdAt} `
            } else if (transaction_name) {
                sql += `WHERE trx.transaction_name LIKE "%${transaction_name}%" `
            }

            const findData = await db.sequelize.query(
                (sql += `GROUP BY trx.id `)
            )

            const getTransactionId = findData[0].map((val) => val.TransactionId)

            const dataCount = getTransactionId.length

            const transactionList = await Transaction.findAndCountAll({
                limit: Number(_limit),
                offset: (_page - 1) * _limit,
                order: [[_sortBy, _sortDir]],
                include: [
                    {
                        model: TransactionItem,
                        include: [
                            {
                                model: Product,
                                include: [
                                    {
                                        model: Image_Url,
                                    },
                                    {
                                        model: Total_Stock,
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        model: db.Order_status,
                    },
                    { model: User },
                    { model: Warehouse },
                ],
                where: {
                    id: getTransactionId,
                },
            })
            return res.status(200).json({
                message: "Filtered",
                data: transactionList.rows,
                dataCount: dataCount,
            })
        } catch (err) {
            return res.status(500).json({
                message: "Server Error",
            })
        }
    },
    findWarehouse: async (req, res) => {
        try {
            const response = await db.Warehouse.findAll()

            return res.status(200).json({
                message: "Find all warehouse",
                data: response,
            })
        } catch (err) {
            return res.status(500).json({
                message: "Server Error",
            })
        }
    },
}

module.exports = adminOrderHistoryController
