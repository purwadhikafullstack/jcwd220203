const { sequelize } = require("../models")
const db = require("../models")
const pagination = require("../lib/sales/pagination")
const paginationData = require("../lib/sales/paginationData")

const salesReportController = {
    getReport: async (req, res) => {
        const CategoryId = req.query.CategoryId
        const WarehouseId = req.query.WarehouseId
        const { createdAt, _limit = 5, _page = 1 } = req.query
        console.log("cat", CategoryId)
        console.log("war", WarehouseId)
        console.log("mnth", createdAt)
        try {
            if (CategoryId && WarehouseId) {
                const findDataFilterCatWar =
                    await db.Transaction.findAndCountAll({
                        include: [
                            {
                                model: db.Warehouse,
                            },
                            {
                                model: db.TransactionItem,
                                include: [
                                    {
                                        model: db.Product,
                                        include: [
                                            {
                                                model: db.Category,
                                            },
                                        ],
                                        where: { CategoryId },
                                    },
                                ],
                                required: true,
                            },
                        ],
                        where: { WarehouseId },
                        limit: Number(_limit),
                        offset: (_page - 1) * _limit,
                    })
                return res.status(200).json({
                    message: "Get data filtered",
                    data: findDataFilterCatWar.rows,
                    dataCount: findDataFilterCatWar.count,
                })
            } else if (WarehouseId) {
                const findDataFilterWar = await db.Transaction.findAndCountAll({
                    include: [
                        {
                            model: db.Warehouse,
                        },
                        {
                            model: db.TransactionItem,
                            include: [
                                {
                                    model: db.Product,
                                    include: [
                                        {
                                            model: db.Category,
                                        },
                                    ],
                                },
                            ],
                            required: true,
                        },
                    ],
                    where: { WarehouseId },
                    limit: Number(_limit),
                    offset: (_page - 1) * _limit,
                })
                return res.status(200).json({
                    message: "Get data filtered",
                    data: findDataFilterWar.rows,
                    dataCount: findDataFilterWar.count,
                })
            } else if (CategoryId) {
                const findDataFilterCat = await db.Transaction.findAndCountAll({
                    include: [
                        {
                            model: db.Warehouse,
                        },
                        {
                            model: db.TransactionItem,
                            include: [
                                {
                                    model: db.Product,
                                    include: [
                                        {
                                            model: db.Category,
                                        },
                                    ],
                                    where: { CategoryId },
                                },
                            ],
                            required: true,
                        },
                    ],
                    limit: Number(_limit),
                    offset: (_page - 1) * _limit,
                })
                return res.status(200).json({
                    message: "Get data filtered",
                    data: findDataFilterCat.rows,
                    dataCount: findDataFilterCat.count,
                })
            } else if (createdAt) {
                const findDataFilterMnth = await db.Transaction.findAndCountAll(
                    {
                        include: [
                            {
                                model: db.Warehouse,
                            },
                            {
                                model: db.TransactionItem,
                                include: [
                                    {
                                        model: db.Product,
                                        include: [
                                            {
                                                model: db.Category,
                                            },
                                        ],
                                    },
                                ],
                                required: true,
                                subQuery: true,
                            },
                        ],
                        limit: Number(_limit),
                        offset: (_page - 1) * _limit,
                    }
                )
                return res.status(200).json({
                    message: "Get data filtered",
                    data: findDataFilterMnth.rows,
                    dataCount: findDataFilterMnth.count,
                })
            }

            const findData = await db.Transaction.findAndCountAll({
                include: [
                    {
                        model: db.Warehouse,
                    },
                    {
                        model: db.TransactionItem,
                        include: [
                            {
                                model: db.Product,
                                include: [
                                    {
                                        model: db.Category,
                                    },
                                ],
                            },
                        ],
                        attributes: [
                            sequelize.fn(
                                "MONTH",
                                sequelize.col("TransactionItem.createdAt")
                            ),
                        ],
                    },
                ],
                limit: Number(_limit),
                offset: (_page - 1) * _limit,
            })
            return res.status(200).json({
                message: "Get data",
                data: findData.rows,
                dataCount: findData.count,
            })
        } catch (err) {
            return res.status(500).json({
                message: err.message,
            })
        }
    },

    getReportWithQuery: async (req, res) => {
        const CategoryId = req.query.CategoryId
        const WarehouseId = req.query.WarehouseId[0]
        const {
            createdAt,
            product_name = "",
            category_name = "",
            _limit = 10,
            _page = 1,
        } = req.query
        // const page = parseInt(req.query.page)
        // const { _limit, _offset } = pagination(page)
        console.log("ct", CategoryId)
        console.log("wr", WarehouseId)
        console.log("mnth", createdAt)
        console.log("pr", product_name)
        console.log("cname", category_name)
        try {
            const { _sortBy = "" } = req.query
            let sql = `SELECT  trx.WarehouseId, pr.CategoryId, pr.id AS productId, ct.category_name, pr.product_name, pr.description, trx_items.price_per_item AS price, trx_items.quantity,
                        trx_items.price_per_item * trx_items.quantity AS total, wr.warehouse_name, trx_items.createdAt
                        FROM transactionitems AS trx_items
                        JOIN transactions AS trx ON trx.id = trx_items.TransactionId
                        JOIN products AS pr ON pr.id = trx_items.ProductId
                        JOIN categories AS ct ON ct.id = pr.CategoryId
                        JOIN warehouses as wr ON wr.id = trx.WarehouseId `

            if (WarehouseId && CategoryId && createdAt) {
                sql += `WHERE WarehouseId=${WarehouseId} AND CategoryId=${CategoryId} AND MONTH(trx_items.createdAt)=${createdAt} `
            } else if (WarehouseId && CategoryId) {
                sql += `WHERE WarehouseId=${WarehouseId} AND CategoryId=${CategoryId} `
            } else if (WarehouseId && createdAt) {
                sql += `WHERE WarehouseId=${WarehouseId} AND MONTH(trx_items.createdAt)=${createdAt} `
            } else if (CategoryId && createdAt) {
                sql += `WHERE CategoryId=${CategoryId} AND MONTH(trx_items.createdAt)=${createdAt} `
            } else if (CategoryId) {
                sql += `WHERE CategoryId=${CategoryId} `
            } else if (WarehouseId) {
                sql += `WHERE WarehouseId=${WarehouseId} `
            } else if (createdAt) {
                sql += `WHERE MONTH(trx_items.createdAt)=${createdAt} `
            } else if (product_name) {
                sql += `WHERE pr.product_name LIKE "%${product_name}%" `
            } else if (category_name) {
                sql += `WHERE ct.category_name LIKE "%${category_name}%" `
            }

            const dataCount = await db.sequelize.query(sql)
            const dataCountReal = dataCount[0]

            sql += `ORDER BY trx_items.createdAt ${_sortBy}
                    LIMIT ${_limit}
                    OFFSET ${(_page - 1) * _limit} `

            const findData = await db.sequelize.query(sql)
            const findDataReal = findData[0]

            // const result = paginationData(findData, page, _limit)
            return res.status(200).json({
                message: "Filtered",
                data: findDataReal,
                dataCount: dataCountReal.length,
            })
        } catch (err) {
            return res.status(500).json({
                message: err.message,
            })
        }
    },
}

module.exports = salesReportController
