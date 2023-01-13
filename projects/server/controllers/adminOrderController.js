const db = require("../models")
const emailer = require("../lib/emailer")
const fs = require("fs")
const handlebars = require("handlebars")
const { Op } = require("sequelize")
const moment = require("moment")
const schedule = require("node-schedule")

const adminOrderController = {
  waitingConfirmation: async (req, res) => {
    try {
      const {
        username = "",
        transaction_name = "",
        PaymentStatusId = "",
        OrderStatusId = "",
        WarehouseId = "",
        payment_method = "",
        _sortBy = "id",
        _sortDir = "ASC",
        _limit = 6,
        _page = 1,
      } = req.query

      const findAdmin = await db.User.findOne({
        where: {
          id: req.user.id,
        },
      })

      if (
        _sortBy === "createdAt" ||
        username ||
        transaction_name ||
        payment_method ||
        PaymentStatusId ||
        OrderStatusId ||
        WarehouseId
      ) {
        if (
          !Number(PaymentStatusId) &&
          !Number(OrderStatusId) &&
          !Number(WarehouseId) &&
          !payment_method
        ) {
          const response = await db.Transaction.findAndCountAll({
            limit: Number(_limit),
            offset: (_page - 1) * _limit,
            order: [[_sortBy, _sortDir]],
            include: [
              {
                model: db.User,
                require: true,
              },
              { model: db.Order_status },
              { model: db.Payment_status },
              { model: db.Warehouse },
            ],
            where: {
              [Op.or]: {
                transaction_name: {
                  [Op.like]: `%${transaction_name}%`,
                },
                "$User.username$": {
                  [Op.like]: `%${username}%`,
                },
              },
            },
          })

          return res.status(200).json({
            message: "Waiting Confrimation By Search",
            data: response.rows,
            dataCount: response.count,
          })
        }

        const response = await db.Transaction.findAndCountAll({
          limit: Number(_limit),
          offset: (_page - 1) * _limit,
          order: [[_sortBy, _sortDir]],
          where: {
            transaction_name: {
              [Op.like]: `%${transaction_name}%`,
            },
            [Op.or]: {
              ...(Number(PaymentStatusId) &&
              Number(OrderStatusId) &&
              Number(WarehouseId) &&
              payment_method
                ? {
                    [Op.and]: {
                      payment_method,
                      PaymentStatusId,
                      OrderStatusId,
                      WarehouseId,
                    },
                  }
                : {}),
              ...(Number(OrderStatusId) &&
              Number(PaymentStatusId) &&
              payment_method
                ? {
                    [Op.and]: {
                      payment_method,
                      PaymentStatusId,
                      OrderStatusId,
                    },
                  }
                : {}),
              ...(Number(OrderStatusId) &&
              Number(PaymentStatusId) &&
              Number(WarehouseId)
                ? {
                    [Op.and]: {
                      WarehouseId,
                      PaymentStatusId,
                      OrderStatusId,
                    },
                  }
                : {}),
              ...(Number(OrderStatusId) && Number(WarehouseId) && payment_method
                ? {
                    [Op.and]: {
                      payment_method,
                      WarehouseId,
                      OrderStatusId,
                    },
                  }
                : {}),
              ...(Number(WarehouseId) &&
              Number(PaymentStatusId) &&
              payment_method
                ? {
                    [Op.and]: {
                      PaymentStatusId,
                      WarehouseId,
                      payment_method,
                    },
                  }
                : {}),
              ...(Number(PaymentStatusId) && Number(OrderStatusId)
                ? {
                    [Op.and]: {
                      PaymentStatusId,
                      OrderStatusId,
                    },
                  }
                : {}),
              ...(payment_method && Number(OrderStatusId)
                ? {
                    [Op.and]: {
                      payment_method,
                      OrderStatusId,
                    },
                  }
                : {}),
              ...(Number(PaymentStatusId) && payment_method
                ? {
                    [Op.and]: {
                      PaymentStatusId,
                      payment_method,
                    },
                  }
                : {}),
              ...(Number(PaymentStatusId) && Number(WarehouseId)
                ? {
                    [Op.and]: {
                      PaymentStatusId,
                      WarehouseId,
                    },
                  }
                : {}),
              ...(Number(WarehouseId) && Number(OrderStatusId)
                ? {
                    [Op.and]: {
                      OrderStatusId,
                      WarehouseId,
                    },
                  }
                : {}),
              ...(Number(WarehouseId) && payment_method
                ? {
                    [Op.and]: {
                      WarehouseId,
                      payment_method,
                    },
                  }
                : {}),
              ...(Number(PaymentStatusId) && Number(WarehouseId)
                ? {
                    [Op.and]: {
                      PaymentStatusId,
                      WarehouseId,
                    },
                  }
                : {}),
              ...(Number(WarehouseId) && Number(OrderStatusId)
                ? {
                    [Op.and]: {
                      WarehouseId,
                      OrderStatusId,
                    },
                  }
                : {}),
              ...(Number(WarehouseId) && payment_method
                ? {
                    [Op.and]: {
                      WarehouseId,
                      payment_method,
                    },
                  }
                : {}),
              PaymentStatusId,
              OrderStatusId,
              payment_method,
              WarehouseId,
            },
          },
          include: [
            {
              model: db.User,
              where: {
                username: {
                  [Op.like]: `%${username}%`,
                },
              },
            },
            { model: db.Order_status },
            { model: db.Payment_status },
            { model: db.Warehouse },
          ],
        })

        return res.status(200).json({
          message: "Waiting Confrimation Or",
          data: response.rows,
          dataCount: response.count,
        })
      }

      const response = await db.Transaction.findAndCountAll({
        offset: (_page - 1) * _limit,
        limit: Number(_limit),
        order: [[_sortBy, _sortDir]],
        include: [
          { model: db.User },
          { model: db.Order_status },
          { model: db.Payment_status },
          { model: db.Warehouse },
        ],
      })

      return res.status(200).json({
        message: "Waiting Confrimation",
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
  findOrderStatus: async (req, res) => {
    try {
      const response = await db.Order_status.findAll()

      return res.status(200).json({
        message: "Find all order status",
        data: response,
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "Server Error",
      })
    }
  },
  findPaymentStatus: async (req, res) => {
    try {
      const response = await db.Payment_status.findAll()

      return res.status(200).json({
        message: "Find all payment status",
        data: response,
      })
    } catch (error) {
      console.log(error)
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
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "Server Error",
      })
    }
  },
  approvePayment: async (req, res) => {
    try {
      const { id } = req.params
      const findTransaction = await db.Transaction.findOne({
        include: [{ model: db.Warehouse }],
        where: {
          id: id,
        },
      })

      if (!findTransaction) {
        return res.status(400).json({
          message: "Transaction not found",
        })
      }

      if (!findTransaction.payment_proof) {
        return res.status(400).json({
          message: "Payment Proof not found",
        })
      }

      // Jurnal Function
      const addOrAdd = (stock_before, stock_after) => {
        const count = Math.max(stock_before, stock_after)
        if (count == stock_before) {
          return false
        } else {
          return true
        }
      }

      await db.Transaction.update(
        {
          OrderStatusId: 2,
          PaymentStatusId: 3,
        },
        {
          where: {
            id: id,
          },
        }
      )

      // Cari semua item dari 1 transaksi
      const findItems = await db.TransactionItem.findAll({
        where: {
          TransactionId: id,
        },
      })

      const transactionItemId = findItems.map((val) => val.id)
      const productId = findItems.map((val) => val.ProductId)
      const quantity = findItems.map((val) => val.quantity)

      // Bikin sebuah objek
      const transactionItemData = quantity.map((val, i) => {
        return {
          id: transactionItemId[i],
          productId: productId[i],
          stock: val,
        }
      })

      // Cari total stock dari tiap produk
      const totalStock = []
      for (let i = 0; i < productId.length; i++) {
        const findStock = await db.Total_Stock.findAll({
          where: {
            WarehouseId: findTransaction.WarehouseId,
            ProductId: productId[i],
          },
        })
        totalStock.push(findStock[0].stock)
      }

      // cari produk quantity yg lebih dari total stok
      const arr = []
      for (let i = 0; i < totalStock.length; i++) {
        let result = 0
        result = totalStock[i] - quantity[i]
        arr.push(result)
      }

      // di jadiin array
      const arr1 = arr.map((val, i) => {
        return {
          transactionItemId: transactionItemId[i],
          productId: productId[i],
          quantity: quantity[i],
          stock: val,
        }
      })

      // filter barang yg total stock nya kurang dari 0
      const stockMutation = arr1.filter((val) => {
        return val.stock < 0
      })

      // di jadikan bilangan positif
      const difference = stockMutation.map((val) => val.stock * -1)

      // ambil id product
      const ProductMutationId = stockMutation.map((val) => val.productId)

      // ambil id transaction item
      const findTransactionItem = stockMutation.map(
        (val) => val.transactionItemId
      )

      // mencari warehouse terdekat
      const findClosestWarehouse = await db.Warehouse.findAll()

      function toRad(Value) {
        return (Value * Math.PI) / 180
      }

      function calcCrow(lat1, lon1, lat2, lon2) {
        var R = 6371 // km
        var dLat = toRad(lat2 - lat1)
        var dLon = toRad(lon2 - lon1)
        var lat1 = toRad(lat1)
        var lat2 = toRad(lat2)

        var a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.sin(dLon / 2) *
            Math.sin(dLon / 2) *
            Math.cos(lat1) *
            Math.cos(lat2)
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        var d = R * c
        return d
      }

      const chooseOne = []
      for (var i = 0; i < findClosestWarehouse.length; i++) {
        const nearestWarehouse = calcCrow(
          findTransaction.Warehouse.latitude,
          findTransaction.Warehouse.longitude,
          findClosestWarehouse[i].latitude,
          findClosestWarehouse[i].longitude
        )

        if (findClosestWarehouse[i].id === findTransaction.Warehouse.id) {
          continue
        }

        chooseOne.push({
          warehouse: findClosestWarehouse[i],
          distance: nearestWarehouse,
        })
      }

      const warehouseSort = chooseOne
        .sort((a, b) => a.distance - b.distance)
        .map((val) => val.warehouse.id)

      // ambil product stock dari warehouse terdekat
      const minusStock = []
      const closesStock = []
      for (let i = 0; i < ProductMutationId.length; i++) {
        const findTotalStockProduct = await db.Total_Stock.findAll({
          where: {
            WarehouseId: warehouseSort[0],
            ProductId: ProductMutationId[i],
          },
        })

        if (findTotalStockProduct.map((val) => val.stock) < difference[i]) {
          return res.status(200).json({
            message: `Warehouse ${warehouseSort[0]} out of stock`,
          })
        }

        minusStock.push(
          findTotalStockProduct.map((val, idx) => val.stock - difference[idx])
        )
        closesStock.push(findTotalStockProduct.map((val) => val.stock))
      }

      // tambah stock ke warehouseId transaction
      const plushStock = []
      const beforeMut = []
      for (let i = 0; i < ProductMutationId.length; i++) {
        const findTotalStockProduct = await db.Total_Stock.findAll({
          where: {
            WarehouseId: findTransaction.WarehouseId,
            ProductId: ProductMutationId[i],
          },
        })

        plushStock.push(
          findTotalStockProduct.map((val) => val.stock + difference[i])
        )
        beforeMut.push(findTotalStockProduct.map((val) => val.stock))
      }

      for (let i = 0; i < findTransactionItem.length; i++) {
        await db.Mutation.create({
          from_warehouse: findTransaction.WarehouseId,
          to_warehouse: warehouseSort[0],
          quantity: difference[i],
          mutation_status: "Approve",
          ProductId: ProductMutationId[i],
          TransactionId: id,
        })
        await db.Total_Stock.update(
          {
            stock: minusStock[i],
          },
          {
            where: {
              WarehouseId: warehouseSort[0],
              ProductId: ProductMutationId[i],
            },
          }
        )
        const journal = await db.Type_Journal.create({
          name: "Mutation Stock",
          type: addOrAdd(closesStock[i], minusStock[i]),
          stock_after: minusStock[i],
          ProductId: productId[i],
        })

        const findTypeId = await db.Type_Journal.findByPk(journal.id)

        await db.Journal.create({
          stock_before: closesStock[i],
          stock_after: minusStock[i],
          ProductId: productId[i],
          TypeJournalId: findTypeId.dataValues.id,
        })
      }

      for (let i = 0; i < findTransactionItem.length; i++) {
        await db.Total_Stock.update(
          {
            stock: plushStock[i],
          },
          {
            where: {
              WarehouseId: findTransaction.WarehouseId,
              ProductId: ProductMutationId[i],
            },
          }
        )
        const journal = await db.Type_Journal.create({
          name: "Mutation Stock",
          type: addOrAdd(beforeMut[i], plushStock[i]),
          stock_after: plushStock[i],
          ProductId: productId[i],
        })

        const findTypeId = await db.Type_Journal.findByPk(journal.id)

        await db.Journal.create({
          stock_before: beforeMut[i],
          stock_after: plushStock[i],
          ProductId: productId[i],
          TypeJournalId: findTypeId.dataValues.id,
        })
      }

      // stock di kurang dari WarehouseId yg sudah mutasi stock
      const finalStock = []
      const stockBefore = []
      for (let i = 0; i < productId.length; i++) {
        const findTotalStockProduct = await db.Total_Stock.findAll({
          where: {
            WarehouseId: findTransaction.WarehouseId,
            ProductId: productId[i],
          },
        })

        finalStock.push(
          findTotalStockProduct.map((val) => val.stock - quantity[i])
        )
        stockBefore.push(findTotalStockProduct.map((val) => val.stock))
      }

      for (let i = 0; i < productId.length; i++) {
        await db.Total_Stock.update(
          {
            stock: finalStock[i],
          },
          {
            where: {
              ProductId: productId[i],
              WarehouseId: findTransaction.WarehouseId,
            },
          }
        )

        const journal = await db.Type_Journal.create({
          name: "Order Stock",
          type: addOrAdd(stockBefore[i], finalStock[i]),
          stock_after: finalStock[i],
          ProductId: productId[i],
        })

        const findTypeId = await db.Type_Journal.findByPk(journal.id)

        await db.Journal.create({
          stock_before: stockBefore[i],
          stock_after: finalStock[i],
          ProductId: productId[i],
          TypeJournalId: findTypeId.dataValues.id,
        })
      }

      const findApproveTrasanction = await db.Transaction.findOne({
        where: {
          id: id,
        },
        include: [{ model: db.User }, { model: db.Warehouse }],
      })

      const totalBill = findApproveTrasanction.total_price
      const paymentDate = moment(findApproveTrasanction.payment_date).format(
        "dddd, DD MMMM YYYY, HH:mm:ss"
      )
      const transactionLink = `${process.env.BASE_URL_FE}transaction-list`

      const rawHTML = fs.readFileSync("templates/approvePayment.html", "utf-8")

      const compiledHTML = handlebars.compile(rawHTML)

      const htmlResult = compiledHTML({
        username: findApproveTrasanction.User.username,
        totalBill: totalBill.toLocaleString(),
        paymentMethod: findApproveTrasanction.payment_method,
        dateAndTime: `${paymentDate} WIB`,
        transactionListLink: transactionLink,
        shopediaLink: process.env.BASE_URL_FE,
      })

      await emailer({
        to: findApproveTrasanction.User.email,
        html: htmlResult,
        subject: "Payment Verified",
        text: "Thank You",
      })

      return res.status(200).json({
        message: "Payment Approved",
        data: findApproveTrasanction,
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "Server Error",
      })
    }
  },
  rejectPayment: async (req, res) => {
    try {
      const { id } = req.params
      const { message } = req.body

      const findTransaction = await db.Transaction.findOne({
        where: {
          id: id,
        },
        include: [{ model: db.User }],
      })

      if (!findTransaction) {
        return res.status(400).json({
          message: "Transaction not found",
        })
      }

      await db.Transaction.update(
        {
          PaymentStatusId: 1,
          is_paid: fasle,
        },
        {
          where: {
            id: id,
          },
        }
      )

      const uploadLink = `${process.env.BASE_URL_FE}payment/thank-you/shopedia/${findTransaction.transaction_name}`

      const rawHTML = fs.readFileSync(
        "templates/rejectTransaction.html",
        "utf-8"
      )

      const compiledHTML = handlebars.compile(rawHTML)

      const htmlResult = compiledHTML({
        username: findTransaction.User.username,
        uploadLink,
        message,
      })

      await emailer({
        to: findTransaction.User.email,
        html: htmlResult,
        subject: "Reject Payment",
        text: "Please reupload your payment proof",
      })

      return res.status(200).json({
        message: "Payment Rejected",
        data: findTransaction,
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "Server Error",
      })
    }
  },
  sendOrder: async (req, res) => {
    try {
      const { id } = req.params

      const findTransaction = await db.Transaction.findOne({
        where: {
          id: id,
        },
        include: [{ model: db.User }],
      })

      if (!findTransaction) {
        return res.status(400).json({
          message: "Transaction not found",
        })
      }

      await db.Transaction.update(
        {
          OrderStatusId: 3,
        },
        {
          where: {
            id: id,
          },
        }
      )

      const dueDateConfirm = moment()
        .add(7, "days")
        .format("YYYY-MM-DD HH:mm:ss")

      schedule.scheduleJob(
        dueDateConfirm,
        async () =>
          await db.Transaction.update(
            {
              OrderStatusId: 5,
            },
            {
              where: {
                id: id,
              },
            }
          )
      )

      const rawHTML = fs.readFileSync("templates/orderSend.html", "utf-8")

      const compiledHTML = handlebars.compile(rawHTML)

      const htmlResult = compiledHTML({
        username: findTransaction.User.username,
        shopediaLink: process.env.BASE_URL_FE,
      })

      await emailer({
        to: findTransaction.User.email,
        html: htmlResult,
        subject: "Order Send",
        text: "Please make your new order",
      })

      return res.status(200).json({
        message: "Order Send",
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "Server Error",
      })
    }
  },
  cancelOrder: async (req, res) => {
    try {
      const { id } = req.params

      const findTransaction = await db.Transaction.findOne({
        where: {
          id: id,
          OrderStatusId: 2,
        },
        include: [{ model: db.TransactionItem }, { model: db.User }],
      })

      if (!findTransaction) {
        return res.status(400).json({
          message: "Transaction invalid",
        })
      }

      await db.Transaction.update(
        {
          OrderStatusId: 6,
        },
        {
          where: {
            id: id,
          },
        }
      )

      const quantity = findTransaction.TransactionItems.map(
        (val) => val.quantity
      )

      const ProductId = findTransaction.TransactionItems.map(
        (val) => val.ProductId
      )

      const returnStock = []
      const stock_before = []
      for (let i = 0; i < ProductId.length; i++) {
        const stockBefore = await db.Total_Stock.findAll({
          where: {
            WarehouseId: findTransaction.WarehouseId,
            ProductId: ProductId[i],
          },
        })
        stock_before.push(stockBefore.map((val) => val.stock))
        returnStock.push(stockBefore.map((val) => val.stock + quantity[i]))
      }

      for (let i = 0; i < ProductId.length; i++) {
        await db.Total_Stock.update(
          {
            ProductId: ProductId[i],
            stock: returnStock[i],
          },
          {
            where: {
              WarehouseId: findTransaction.WarehouseId,
              ProductId: ProductId[i],
            },
          }
        )
      }

      const stock_after = []
      for (let i = 0; i < ProductId.length; i++) {
        const findData = await db.Total_Stock.findAll({
          where: {
            WarehouseId: findTransaction.WarehouseId,
            ProductId: ProductId[i],
          },
        })
        stock_after.push(findData.map((val) => val.stock))
      }

      const addOrAdd = (stock_before, stock_after) => {
        const count = Math.max(stock_before, stock_after)
        if (count === stock_before) {
          return false
        } else {
          return true
        }
      }

      for (let i = 0; i < ProductId.length; i++) {
        const journal = await db.Type_Journal.create({
          name: "Cancel Stock",
          type: addOrAdd(stock_before[i], stock_after[i]),
          stock_after: stock_after[i],
          ProductId: ProductId[i],
        })

        const findTypeId = await db.Type_Journal.findByPk(journal.id)

        await db.Journal.create({
          stock_before: stock_before[i],
          stock_after: stock_after[i],
          ProductId: ProductId[i],
          TypeJournalId: findTypeId.id,
        })
      }

      const rawHTML = fs.readFileSync("templates/orderCancel.html", "utf-8")

      const compiledHTML = handlebars.compile(rawHTML)

      const htmlResult = compiledHTML({
        username: findTransaction.User.username,
        shopediaLink: process.env.BASE_URL_FE,
      })

      await emailer({
        to: findTransaction.User.email,
        html: htmlResult,
        subject: "Cancel Order",
        text: "Please make your new order",
      })

      return res.status(200).json({
        message: "Order Canceled",
        data: findTransaction,
      })
    } catch (error) {
      console.log(error)
      return res.status(200).json({
        message: "Server Error",
      })
    }
  },
  deliverOrder: async (req, res) => {
    try {
      const { id } = req.params

      const findTransaction = await db.Transaction.findOne({
        where: {
          id: id,
          OrderStatusId: 3,
        },
        include: [{ model: db.User }],
      })

      if (!findTransaction) {
        return res.status(400).json({
          message: "Transaction not found",
        })
      }

      await db.Transaction.update(
        {
          OrderStatusId: 4,
        },
        {
          where: {
            id: id,
          },
        }
      )

      const rawHTML = fs.readFileSync("templates/orderDelivered.html", "utf-8")

      const compiledHTML = handlebars.compile(rawHTML)

      const htmlResult = compiledHTML({
        username: findTransaction.User.username,
        shopediaLink: process.env.BASE_URL_FE,
      })

      await emailer({
        to: findTransaction.User.email,
        html: htmlResult,
        subject: "Delivere Order",
        text: "Your order is delivered",
      })

      return res.status(200).json({
        message: "Order Delivered",
      })
    } catch (error) {
      console.log(error)
      return res.status(200).json({
        message: "Server Error",
      })
    }
  },
}

module.exports = adminOrderController
