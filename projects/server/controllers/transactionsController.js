const db = require("../models")
const moment = require("moment")

const { Cart, Transaction, TransactionItem } = db

const transactionsController = {
    checkoutCartItems: async (req, res) => {
        try {

            const getCheckedCartItems = await Cart.findAll({
                where: {
                    UserId: req.user.id,
                    is_checked: true
                },
                include: [
                    {
                        model: db.Product,
                        include: [
                            {
                                model: db.Image_Url,
                            },
                            {
                                model: db.Total_Stock
                            }
                        ],
                    },
                ],
                order: [["createdAt", "DESC"]],
            })

            return res.status(200).json({
                message: "showMyItemCart",
                data: getCheckedCartItems
            })

        } catch (err) {
            console.log(err)
        }
    },
    createNewTransaction: async (req, res) => {
        try {
            const { payment_method, shipping_fee, total_price, AddressId, courir_duration, WarehouseId } = req.body

            const getCheckedCartItems = await Cart.findAll({
                where: {
                    UserId: req.user.id,
                    is_checked: true
                },
                include: [
                    {
                        model: db.Product,
                        include: [
                            {
                                model: db.Image_Url,
                            },
                            {
                                model: db.Total_Stock
                            }
                        ],
                    },
                ],
                order: [["createdAt", "DESC"]],
            })


            const getTotal = await db.sequelize.query(
                `select sum(stock) totalStock, p.id ProductId, p.product_name, c.is_checked, c.UserId, c.quantity from Products p
                join total_stocks ts
                on p.id = ts.ProductId
                join carts c
                on p.id = c.ProductId
                where is_checked = ${true} && UserId = ${req.user.id} 
                group by c.id;`
            )

            const productNameArr = getTotal[0].map((val) => val.product_name)
            console.log(getTotal[0].map((val) => val.product_name))

            const stockProduct = getTotal[0]

            const arrProductStock = stockProduct.map((val) => Number(val.totalStock))

            const arrCartQuantity = stockProduct.map((val) => val.quantity)

            for (let i = 0; i < arrProductStock.length; i++) {

                if (arrProductStock[i] < arrCartQuantity[i]) {
                    return res.status(400).json({
                        message: `Insufficient product stock ${productNameArr[i]}`
                    })
                }
            }

            let totalPrice = 0

            let totalQuantity = 0

            const transactionItems = getCheckedCartItems.map((cart) => {
                const qty = cart.quantity

                totalQuantity += Number(qty)
                totalPrice += cart.Product.price * qty

                return {
                    CartId: cart.id,
                    ProductId: cart.ProductId,
                    note: cart.note,
                    quantity: qty,
                    price_per_item: cart.Product.price,
                }
            })

            const total_quantity = totalQuantity

            const payment_date = moment().add().format("YYYY-MM-DD HH:mm:ss")

            const expDate = moment().add(1, 'days').format("YYYY-MM-DD HH:mm:ss")

            const createTransaction = await Transaction.create({
                total_price: total_price,
                total_quantity: total_quantity,
                UserId: req.user.id,
                shipping_fee: shipping_fee,
                payment_method: `${payment_method} Virtual Account`,
                payment_expired_date: expDate,
                OrderStatusId: 0,
                PaymentStatusId: 1,
                AddressId: AddressId,
                courir_duration: courir_duration,
                payment_date: payment_date,
                WarehouseId: WarehouseId
            })

            await Transaction.update(
                {
                    transaction_name: `SPJWCD202212${createTransaction.id}`
                },
                {
                    where: {
                        id: createTransaction.id
                    }
                }
            )

            await TransactionItem.bulkCreate(
                transactionItems.map((item) => {
                    return {
                        ...item,
                        TransactionId: createTransaction.id
                    }
                })
            )

            await db.Cart.destroy({
                where: {
                    UserId: req.user.id,
                    is_checked: true
                },
            })

            const findCreatedTransaction = await Transaction.findByPk(createTransaction.id, {
                include: [{
                    model: TransactionItem,
                    include: [
                        { model: db.Product }
                    ]
                }]
            })

            return res.status(201).json({
                message: "Transaction created",
                data: findCreatedTransaction
            })

        } catch (err) {
            console.log(err)
            return res.status(500).json({
                message: "Server error",
            })
        }
    },
    getTransactionByTransactionName: async (req, res) => {
        try {
            const { transaction_name } = req.query

            const findTransactionByTransactionName = await Transaction.findOne({
                where: {
                    transaction_name: transaction_name
                },
                include: [{
                    model: TransactionItem,
                    include: [
                        { model: db.Product }
                    ],
                },
                { model: db.Address }
                ]
            })
            return res.status(201).json({
                message: "Get transaction by name",
                data: findTransactionByTransactionName
            })

        } catch (err) {
            console.log(err)
            return res.status(500).json({
                message: "Server error",
            })
        }
    },
    paymentProofUpload: async (req, res) => {
        try {
            const { transaction_name } = req.params

            if (req.file) {
                req.body.payment_proof = `http://localhost:8000/public/${req.file.filename}`
            }

            const { payment_proof } = req.body

            await Transaction.update(
                {
                    payment_proof: payment_proof,
                    PaymentStatusId: 2,
                    OrderStatusId: 1,
                    is_paid: true,
                },
                {
                    where:
                    {
                        transaction_name: transaction_name
                    }
                })

            const findpaymentProof = await Transaction.findOne({
                where: {
                    transaction_name: transaction_name,
                }
            })

            return res.status(200).json({
                message: "payment proof uploaded",
                data: findpaymentProof
            })
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                message: "Server error",
            })
        }
    },
    setPaymentExpired: async (req, res) => {
        try {
            const { transaction_name } = req.params

            await Transaction.update(
                {
                    PaymentStatusId: 4,
                    is_paid: null
                },
                {
                    where: {
                        transaction_name,
                    }
                })

            return res.status(200).json({
                message: "payment expired",
            })

        } catch (err) {
            console.log(err)
            return res.status(500).json({
                message: "Server error",
            })
        }
    },
}

module.exports = transactionsController