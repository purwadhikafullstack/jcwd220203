const db = require("../models")
const { Cart } = db

const cartsController = {
    addToCart: async (req, res) => {
        try {
            const { ProductId, quantity, note } = req.body

            const findProductinCart = await Cart.findOne({
                where: {
                    ProductId,
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
            })

            const findProductById = await db.Product.findByPk(ProductId, {
                include: [
                    {
                        model: db.Image_Url,
                    },
                    {
                        model: db.Total_Stock
                    }
                ],
            })


            const stock = findProductById.Total_Stocks.map((val) => val.stock)

            let total = 0

            for (let i = 0; i < stock.length; i++) {
                total += Number(stock[i])
            }

            const totalStock = total

            if (totalStock === 0) {
                return res.status(400).json({
                    message: "Insufficient product stock"
                })
            }

            if (!findProductinCart && quantity > totalStock) {
                return res.status(400).json({
                    message: "Insufficient product stock"
                })
            }

            if (!findProductinCart) {
                const addProductToCart = await Cart.create({
                    UserId: req.user.id,
                    ProductId: ProductId,
                    note: note,
                    quantity: quantity
                })

                const findCart = await Cart.findByPk(addProductToCart.id, {
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
                })

                return res.status(201).json({
                    message: "Product added to cart",
                    data: findCart
                })
            }

            const cartStock = findProductinCart.Product.Total_Stocks.map((val) => val.stock)

            let cartTotal = 0

            for (let i = 0; i < cartStock.length; i++) {
                cartTotal += Number(cartStock[i])
            }

            const totalStockCart = cartTotal

            const cartItemQuantity = findProductinCart.quantity

            if (totalStockCart === 0 || totalStockCart < quantity) {
                return res.status(400).json({
                    message: "Insufficient product stock"
                })
            }

            if (totalStockCart === 0 || totalStockCart < cartItemQuantity + quantity) {
                return res.status(400).json({
                    message: "Insufficient product stock"
                })
            }

        } catch (err) {
            console.log(err)
            return res.status(500).json({
                message: "Server error"
            })
        }
    },
    addToCart2: async (req, res) => {
        try {
            const { ProductId } = req.params

            const { quantity, note } = req.body

            const findProductinCart = await Cart.findOne({
                where: {
                    ProductId: ProductId
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
            })

            const cartStock = findProductinCart.Product.Total_Stocks.map((val) => val.stock)

            let cartTotal = 0

            for (let i = 0; i < cartStock.length; i++) {
                cartTotal += Number(cartStock[i])
            }

            const totalStockCart = cartTotal


            if (findProductinCart.quantity + quantity > totalStockCart) {
                return res.status(400).json({
                    message: "Insufficient product stock"
                })
            }

            if (!quantity) {

                await Cart.update(
                    {
                        quantity: findProductinCart.quantity + 1,
                        note: note
                    },
                    {
                        where: {
                            id: findProductinCart.id
                        }
                    }
                )

                return res.status(200).json({
                    message: "Cart item added",
                })
            }

            if (quantity) {
                await Cart.update(
                    {
                        quantity: findProductinCart.quantity + quantity,
                        note: note
                    },
                    {
                        where: {
                            id: findProductinCart.id,
                        }
                    }
                )

                return res.status(200).json({
                    message: "Cart item added",
                })
            }

        } catch (err) {
            console.log(err)
        }
    },
    ShowAllMyCartItems: async (req, res) => {
        try {

            const getAllMyCartItems = await Cart.findAll({
                where: {
                    UserId: req.user.id
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
                data: getAllMyCartItems
            })

        } catch (err) {
            console.log(err)
            return res.status(500).json({
                message: "Server error"
            })
        }
    },
    getCartItemById: async (req, res) => {
        try {
            const { id } = req.params
            const findCartByid = await Cart.findByPk(id, {
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
            })

            return res.status(200).json({
                message: "Get Cart By Id",
                data: findCartByid
            })

        } catch (err) {
            console.log(err)
            return res.status(500).json({
                message: "Server error"
            })
        }
    },
    findCartByProductId: async (req, res) => {
        try {
            const { ProductId } = req.params

            const findProductinCart = await Cart.findOne({
                where: {
                    ProductId,
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
            })

            return res.status(200).json({
                message: "Cart item added",
                data: findProductinCart
            })
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                message: "Server error"
            })
        }
    }
}

module.exports = cartsController