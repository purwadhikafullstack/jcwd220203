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

            const getAllMyCheckedCartItems = await Cart.findAll({
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

            const cartCheckedCount = getAllMyCheckedCartItems.map((val) => val.id)
            const checkedDataCount = cartCheckedCount.length

            return res.status(200).json({
                message: "showMyItemCart",
                data: getAllMyCartItems,
                checkedDataCount: checkedDataCount
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
    },
    incrementCartItems: async (req, res) => {
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

            const cartStock = findCartByid.Product.Total_Stocks.map((val) => val.stock)

            let cartTotal = 0

            for (let i = 0; i < cartStock.length; i++) {
                cartTotal += Number(cartStock[i])
            }

            const totalStockCart = cartTotal


            if (findCartByid.quantity + 1 > totalStockCart) {
                return res.status(400).json({
                    message: "Insufficient product stock"
                })
            }

            await Cart.update(
                {
                    quantity: findCartByid.quantity + 1
                },
                {
                    where: {
                        id: findCartByid.id
                    }
                }
            )

            return res.status(200).json({
                message: "Increment quantity",
            })

        } catch (err) {
            console.log(err)
        }
    },
    decrementCartItems: async (req, res) => {
        try {
            const { id } = req.params

            const findCartByid = await Cart.findByPk(id)

            if (findCartByid.quantity <= 1) {
                return res.status(200).json({
                    message: "Can't decrement",
                })
            }

            await Cart.update(
                {
                    quantity: findCartByid.quantity - 1
                },
                {
                    where: {
                        id: findCartByid.id
                    }
                }
            )

            return res.status(200).json({
                message: "decrement quantity",
            })

        } catch (err) {
            console.log(err)
        }
    },
    deleteProductFromCart: async (req, res) => {
        try {
            const { id } = req.params

            await Cart.destroy({
                where: {
                    id: id
                },
            })
            return res.status(200).json({
                message: "Deleted item from cart",
            })
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                message: "Server error"
            })
        }
    },
    deleteAllCartItems: async (req, res) => {
        try {
            await Cart.destroy({
                where: {
                    UserId: req.user.id,
                    is_checked: true
                },
            })
            return res.status(200).json({
                message: "Deleted All Items From Cart",
            })
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                message: "Server error"
            })
        }
    },
    checkCartItems: async (req, res) => {
        try {
            const { id } = req.params

            const findCartByid = await Cart.findByPk(id)

            if (findCartByid.is_checked === true) {
                await Cart.update(
                    {
                        is_checked: false
                    },
                    {
                        where: {
                            id: findCartByid.id
                        }
                    },
                )
                const cartUncheckedByid = await Cart.findByPk(id, {
                    include: [
                        {
                            model: db.Product,
                            include: [
                                { model: db.Image_Url }
                            ]
                        },
                    ],
                })

                return res.status(200).json({
                    message: "Cart Item Unchecked",
                    data: cartUncheckedByid
                })
            }

            await Cart.update(
                {
                    is_checked: true
                },
                {
                    where: {
                        id: findCartByid.id
                    }
                },
            )
            const cartCheckedByid = await Cart.findByPk(id, {
                include: [
                    {
                        model: db.Product,
                        include: [
                            { model: db.Image_Url }
                        ]
                    },
                ],
            })

            return res.status(200).json({
                message: "Cart Item Checked",
                data: cartCheckedByid
            })
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                message: "Server error"
            })
        }
    },
    checkAllCartItems: async (req, res) => {
        try {

            const findCartByUserId = await Cart.findAll({
                where: {
                    UserId: req.user.id
                },
                include: [
                    {
                        model: db.Product,
                        include: [
                            { model: db.Image_Url }
                        ]
                    },
                ],
            })

            const cartChecked = findCartByUserId.map((val) => val.is_checked)

            if (!cartChecked.includes(false)) {
                await Cart.update(
                    {
                        is_checked: false
                    },
                    {
                        where: {
                            UserId: req.user.id
                        }
                    },
                )

                const findUncheckedCart = await Cart.findAll({
                    where: {
                        UserId: req.user.id
                    },
                    include: [
                        {
                            model: db.Product,
                            include: [
                                { model: db.Image_Url }
                            ]
                        },
                    ],
                })
                return res.status(200).json({
                    message: "All Cart Items Unchecked",
                    data: findUncheckedCart
                })
            }


            await Cart.update(
                {
                    is_checked: true
                },
                {
                    where: {
                        UserId: req.user.id
                    }
                },
            )

            const findAllCheckedCart = await Cart.findAll({
                where: {
                    UserId: req.user.id
                },
                include: [
                    {
                        model: db.Product,
                        include: [
                            { model: db.Image_Url }
                        ]
                    },
                ],
            })

            return res.status(200).json({
                message: "All Cart Items Checked",
                data: findAllCheckedCart
            })

        } catch (err) {
            console.log(err)
            return res.status(500).json({
                message: "Server error"
            })
        }
    },
    getTotalPrice: async (req, res) => {
        try {
            const { id } = req.user

            const getTotalPrice = await db.sequelize.query(
                `select sum(p.price * c.quantity) as totalPrice, sum(c.quantity) as totalQuantity from carts c
                    join products p
                    on c.ProductId = p.id
                    where is_checked = ${true} && UserId = ${id}`
            )

            const totalPrice = getTotalPrice[0][0]

            return res.status(200).json({
                message: "Get All Cart Items",
                data: totalPrice
            })

        } catch (err) {
            console.log(err)
            return res.status(500).json({
                message: "Server error"
            })
        }
    },
    addCartNote: async (req, res) => {
        try {

            const { id } = req.params
            const { note } = req.body

            await Cart.update(
                {
                    note: note
                },
                {
                    where: {
                        id: id
                    }
                },
            )

            const updateCartNote = await Cart.findByPk(id)
            return res.status(200).json({
                message: "Get All Cart Items",
                data: updateCartNote
            })

        } catch (err) {
            return res.status(500).json({
                message: "Server error"
            })
        }

    }
}

module.exports = cartsController