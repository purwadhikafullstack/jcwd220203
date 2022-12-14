const db = require("../models")

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
            const { payment_method, shipping_fee, total_price } = req.body

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

            // console.log(getCheckedCartItems.id)
            const stockProduct = getTotal[0]

            const arrProductStock = stockProduct.map((val) => Number(val.totalStock))

            const arrCartQuantity = stockProduct.map((val) => val.quantity)

            for (let i = 0; i < arrProductStock.length; i++) {
                if (arrProductStock[i] < arrCartQuantity[i]) {
                    return res.status(400).json({
                        message: "Insufficient product stock"
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
                    price_per_item: cart.Product.price
                }
            })

            const total_quantity = totalQuantity

            const createTransaction = await Transaction.create({
                total_price: total_price,
                total_quantity: total_quantity,
                UserId: req.user.id,
                shipping_fee: shipping_fee,
                payment_method: `${payment_method} Virtual Account`
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

            return res.status(201).json({
                message: "Transaction created",
            })

        } catch (err) {
            console.log(err)
            return res.status(500).json({
                message: "Server error",
            })
        }
    }

}

module.exports = transactionsController