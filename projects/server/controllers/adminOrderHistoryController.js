const db = require("../models")
const { Op } = require("sequelize")
const { sequelize } = require("../models")

const Transaction = db.Transaction
const Transaction_Item = db.TransactionItem
const Warehouse = db.Warehouse
const Product = db.Product
const Total_Stock = db.Total_Stock
const User = db.User
const Order_status = db.Order_status

const adminOrderHistoryController = {
    // showAllTransaction: async (req, res) => {
    //     const {
    //         _sortBy = "id",
    //         // _sortDir = "ASC",
    //         WarehouseId = "id",
    //         ProductId = "id",
    //         _limit = 10,
    //         _page = 1,
    //         TransactionId = "id",
    //     } = req.query
    //     try {
    //         if (WarehouseId) {
    //             const seeAllTransactionWithFilter =
    //                 await Transaction.findAndCountAll({
    //                     limit: Number(_limit),
    //                     offset: (_page - 1) * _limit,
    //                     subQuery: false,
    //                     include: [
    //                         {
    //                             model: Transaction_Item,
    //                             include: [
    //                                 {
    //                                     model: Product,
    //                                     include: [
    //                                         {
    //                                             model: Total_Stock,
    //                                             // where: {
    //                                             //     WarehouseId,
    //                                             // },
    //                                             include: [
    //                                                 {
    //                                                     model: Warehouse,
    //                                                 },
    //                                             ],
    //                                         },
    //                                     ],
    //                                 },
    //                             ],
    //                         },
    //                         { model: User },
    //                     ],

    //                     // order: [[_sortBy]],
    //                 })
    //             return res.status(200).json({
    //                 message: "With filter",
    //                 data: seeAllTransactionWithFilter.rows,
    //                 dataCount: seeAllTransactionWithFilter.count,
    //             })
    //         }

    //         const seeAllTransaction = await Transaction.findAndCountAll({
    //             limit: Number(_limit),
    //             offset: (_page - 1) * _limit,
    //             subQuery: false,
    //             include: [
    //                 {
    //                     model: Transaction_Item,
    //                     include: [
    //                         {
    //                             model: Product,
    //                             include: [
    //                                 {
    //                                     model: Total_Stock,
    //                                     include: [
    //                                         {
    //                                             model: Warehouse,
    //                                         },
    //                                     ],
    //                                 },
    //                             ],
    //                         },
    //                     ],
    //                 },
    //                 { model: User },
    //             ],

    //             // order: [[_sortBy]],
    //         })
    //         return res.status(200).json({
    //             message: "With filter",
    //             data: seeAllTransaction.rows,
    //             dataCount: seeAllTransaction.count,
    //         })
    //     } catch (err) {
    //         console.log(err)
    //         return res.status(500).json({
    //             message: err.message,
    //         })
    //     }
    // },

    getOrder: async (req, res) => {
        const { _limit = 10, _page = 1 } = req.query
        const WarehouseId = req.query.WarehouseId[0]
        console.log(req.query)
        try {
            let query = `SELECT wr.id as warehouse_id,ts.WarehouseId,trx_items.TransactionId,trx.transaction_name, 
            us.username, trx.createdAt, trx.total_quantity, trx.total_price, ps.payment_status_name as order_status, wr.warehouse_name,pr.id as productId                      
                        FROM transactions as trx
                        JOIN users as us ON us.id = trx.UserId
                        JOIN transactionitems as trx_items ON trx_items.TransactionId = trx.id
                        JOIN products as pr ON pr.id = trx_items.ProductId
                        JOIN total_stocks as ts ON ts.ProductId = pr.id
                        JOIN warehouses as wr ON wr.id = ts.WarehouseId
                        JOIN payment_statuses as ps ON ps.id = trx.PaymentStatusId `
            if (WarehouseId) {
                query += `WHERE wr.id = ${WarehouseId} `
            }
            query += `ORDER BY trx_items.TransactionId DESC
                    LIMIT ${_limit}
                    OFFSET ${(_page - 1) * _limit} `

            const test = await db.sequelize.query(query)
            const test0 = test[0]

            const transformArr = (orig) => {
                var newArr = [],
                    types = {},
                    i,
                    j,
                    cur
                for (i = 0, j = orig.length; i < j; i++) {
                    cur = orig[i]
                    if (!(cur.TransactionId in types)) {
                        types[cur.TransactionId] = {
                            TransactionId: cur.TransactionId,
                            product_names: [],
                            prices: [],
                            qtys: [],
                            descriptions: [],
                            productIds: [],
                            usernames: [],
                        }
                        newArr.push(types[cur.TransactionId])
                    }
                    types[cur.TransactionId].product_names.push(
                        cur.product_name
                    )
                    types[cur.TransactionId].prices.push(cur.price)
                    types[cur.TransactionId].qtys.push(cur.qty)
                    types[cur.TransactionId].descriptions.push(cur.description)
                    types[cur.TransactionId].productIds.push(cur.productId)
                    types[cur.TransactionId].usernames.push(cur.username)
                }
                return newArr
            }

            return res.status(200).json({
                message: "Filtered",
                data: test0,
                // dataCount: 5,
            })
        } catch (err) {
            return res.status(500).json({
                message: err.message,
            })
        }
    },

    getByWarehouseId: async (req, res) => {
        try {
            const { WarehouseId, _limit = 10, _page = 1 } = req.query
            if (WarehouseId) {
                const test2 = await Transaction.findAndCountAll({
                    include: [
                        {
                            model: Transaction_Item,
                            include: [
                                {
                                    model: Product,
                                },
                            ],
                        },
                        { model: Warehouse },
                        { model: User },
                        { model: Order_status },
                    ],
                    where: { WarehouseId },
                    limit: Number(_limit),
                    offset: (_page - 1) * _limit,
                    order: [["createdAt", "DESC"]],
                })

                return res.status(200).json({
                    message: "All",
                    data: test2.rows,
                    dataCount: test2.count,
                })
            }
            const test3 = await Transaction.findAndCountAll({
                include: [
                    {
                        model: Transaction_Item,
                        include: [
                            {
                                model: Product,
                            },
                        ],
                    },
                    { model: Warehouse },
                    { model: User },
                    { model: Order_status },
                ],
                limit: Number(_limit),
                offset: (_page - 1) * _limit,
                order: [["createdAt", "DESC"]],
            })

            return res.status(200).json({
                message: "All",
                data: test3.rows,
                dataCount: test3.count,
            })
        } catch (err) {
            return res.status(500).json({
                message: err.message,
            })
        }
    },
}

module.exports = adminOrderHistoryController
