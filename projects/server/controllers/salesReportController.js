const { sequelize } = require("../models")
const db = require("../models")
const pagination = require("../lib/sales/pagination")
const paginationData = require("../lib/sales/paginationData")

const salesReportController = {
    getReport: async (req, res) => {
        const CategoryId = req.query.CategoryId
        const WarehouseId = req.query.WarehouseId[0]
        const {
            createdAt,
            product_name = "",
            category_name = "",
            _limit = 10,
            _page = 1,
        } = req.query
        try {
            const { _sortBy = "" } = req.query
            let sql = `SELECT  trx.WarehouseId, pr.CategoryId, pr.id AS productId, ct.category_name, pr.product_name, pr.description, trx_items.price_per_item AS price, trx_items.quantity,
                        trx_items.price_per_item * trx_items.quantity AS total, wr.warehouse_name, trx_items.createdAt
                        FROM transactionitems AS trx_items
                        JOIN transactions AS trx ON trx.id = trx_items.TransactionId
                        JOIN products AS pr ON pr.id = trx_items.ProductId
                        JOIN categories AS ct ON ct.id = pr.CategoryId
                        JOIN warehouses as wr ON wr.id = trx.WarehouseId `

            if (
                WarehouseId &&
                CategoryId &&
                createdAt &&
                (product_name || category_name)
            ) {
                sql += `WHERE WarehouseId=${WarehouseId} AND CategoryId=${CategoryId} AND MONTH(trx_items.createdAt)=${createdAt} AND (pr.product_name LIKE "%${product_name}%" OR ct.category_name LIKE "%${category_name}%") `
            } else if (
                WarehouseId &&
                CategoryId &&
                (product_name || category_name)
            ) {
                sql += `WHERE WarehouseId=${WarehouseId} AND CategoryId=${CategoryId} AND (pr.product_name LIKE "%${product_name}%" OR ct.category_name LIKE "%${category_name}%") `
            } else if (
                WarehouseId &&
                createdAt &&
                (product_name || category_name)
            ) {
                sql += `WHERE WarehouseId=${WarehouseId} AND MONTH(trx_items.createdAt)=${createdAt} AND (pr.product_name LIKE "%${product_name}%" OR ct.category_name LIKE "%${category_name}%") `
            } else if (
                CategoryId &&
                createdAt &&
                (product_name || category_name)
            ) {
                sql += `WHERE CategoryId=${CategoryId} AND MONTH(trx_items.createdAt)=${createdAt} AND (pr.product_name LIKE "%${product_name}%" OR ct.category_name LIKE "%${category_name}%") `
            } else if (CategoryId && (product_name || category_name)) {
                sql += `WHERE CategoryId=${CategoryId} AND (pr.product_name LIKE "%${product_name}%" OR ct.category_name LIKE "%${category_name}%") `
            } else if (WarehouseId && (product_name || category_name)) {
                sql += `WHERE WarehouseId=${WarehouseId} AND (pr.product_name LIKE "%${product_name}%" OR ct.category_name LIKE "%${category_name}%") `
            } else if (createdAt && (product_name || category_name)) {
                sql += `WHERE MONTH(trx_items.createdAt)=${createdAt} AND (pr.product_name LIKE "%${product_name}%" OR ct.category_name LIKE "%${category_name}%") `
            } else if (WarehouseId && CategoryId && createdAt) {
                sql += `WHERE WarehouseId=${WarehouseId} AND CategoryId=${CategoryId} AND MONTH(trx_items.createdAt)=${createdAt} `
            } else if (WarehouseId && CategoryId) {
                sql += `WHERE WarehouseId=${WarehouseId} AND CategoryId=${CategoryId} `
            } else if (WarehouseId && createdAt) {
                sql += `WHERE WarehouseId=${WarehouseId} AND MONTH(trx_items.createdAt)=${createdAt} `
            } else if (CategoryId && createdAt) {
                sql += `WHERE CategoryId=${CategoryId} AND MONTH(trx_items.createdAt)=${createdAt} `
            } else if (product_name || category_name) {
                sql += `WHERE pr.product_name LIKE "%${product_name}%" OR ct.category_name LIKE "%${category_name}%" `
            } else if (CategoryId) {
                sql += `WHERE CategoryId=${CategoryId} `
            } else if (WarehouseId) {
                sql += `WHERE WarehouseId=${WarehouseId} `
            } else if (createdAt) {
                sql += `WHERE MONTH(trx_items.createdAt)=${createdAt} `
            }
            const dataCount = await db.sequelize.query(sql)
            const dataCountReal = dataCount[0]

            sql += `ORDER BY trx_items.createdAt ${_sortBy}
                    LIMIT ${_limit}
                    OFFSET ${(_page - 1) * _limit} `

            const findData = await db.sequelize.query(sql)
            const findDataReal = findData[0]

            return res.status(200).json({
                message: "Filtered",
                data: findDataReal,
                dataCount: dataCountReal.length,
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

module.exports = salesReportController
