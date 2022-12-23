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

      if (findAdmin.RoleId === 2) {
        if (
          _sortBy === "createdAt" ||
          username ||
          transaction_name ||
          payment_method ||
          PaymentStatusId ||
          OrderStatusId
        ) {
          if (
            !Number(PaymentStatusId) &&
            !Number(OrderStatusId) &&
            !payment_method
          ) {
            const response = await db.Transaction.findAndCountAll({
              limit: Number(_limit),
              offset: (_page - 1) * _limit,
              order: [[_sortBy, _sortDir]],
              where: {
                transaction_name: {
                  [Op.like]: `%${transaction_name}%`,
                },
                WarehouseId: findAdmin.WarehouseId,
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
                {
                  model: db.Warehouse,
                },
              ],
            })

            return res.status(200).json({
              message: "Waiting Confrimation By Search",
              data: response.rows,
              dataCount: response.count,
            })
          }

          if (
            Number(OrderStatusId) &&
            Number(PaymentStatusId) &&
            payment_method
          ) {
            const response = await db.Transaction.findAndCountAll({
              limit: Number(_limit),
              offset: (_page - 1) * _limit,
              order: [[_sortBy, _sortDir]],
              where: {
                transaction_name: {
                  [Op.like]: `%${transaction_name}%`,
                },
                [Op.and]: {
                  payment_method,
                  PaymentStatusId,
                  OrderStatusId,
                },
                WarehouseId: findAdmin.WarehouseId,
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
              ],
            })

            return res.status(200).json({
              message: "Waiting Confrimation And",
              data: response.rows,
              dataCount: response.count,
            })
          }

          if (Number(PaymentStatusId) && Number(OrderStatusId)) {
            const response = await db.Transaction.findAndCountAll({
              limit: Number(_limit),
              offset: (_page - 1) * _limit,
              order: [[_sortBy, _sortDir]],
              where: {
                transaction_name: {
                  [Op.like]: `%${transaction_name}%`,
                },
                [Op.and]: {
                  PaymentStatusId,
                  OrderStatusId,
                },
                WarehouseId: findAdmin.WarehouseId,
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
              ],
            })

            return res.status(200).json({
              message: "Waiting Confrimation And",
              data: response.rows,
              dataCount: response.count,
            })
          }

          if (payment_method && Number(OrderStatusId)) {
            const response = await db.Transaction.findAndCountAll({
              limit: Number(_limit),
              offset: (_page - 1) * _limit,
              order: [[_sortBy, _sortDir]],
              where: {
                transaction_name: {
                  [Op.like]: `%${transaction_name}%`,
                },
                [Op.and]: {
                  payment_method,
                  OrderStatusId,
                },
                WarehouseId: findAdmin.WarehouseId,
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
              ],
            })

            return res.status(200).json({
              message: "Waiting Confrimation And",
              data: response.rows,
              dataCount: response.count,
            })
          }

          if (Number(PaymentStatusId) && payment_method) {
            const response = await db.Transaction.findAndCountAll({
              limit: Number(_limit),
              offset: (_page - 1) * _limit,
              order: [[_sortBy, _sortDir]],
              where: {
                transaction_name: {
                  [Op.like]: `%${transaction_name}%`,
                },
                [Op.and]: {
                  payment_method,
                  PaymentStatusId,
                },
              },
              include: [
                {
                  model: db.User,
                  where: {
                    username: {
                      [Op.like]: `%${username}%`,
                    },
                    WarehouseId: findAdmin.WarehouseId,
                  },
                },
                { model: db.Order_status },
                { model: db.Payment_status },
              ],
            })

            return res.status(200).json({
              message: "Waiting Confrimation And",
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
                PaymentStatusId,
                OrderStatusId,
                payment_method,
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
          where: {
            WarehouseId: findAdmin.WarehouseId,
          },
          include: [
            { model: db.User },
            { model: db.Order_status },
            { model: db.Payment_status },
          ],
        })

        return res.status(200).json({
          message: "Waiting Confrimation",
          data: response.rows,
          dataCount: response.count,
        })
      }

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
            where: {
              transaction_name: {
                [Op.like]: `%${transaction_name}%`,
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
            message: "Waiting Confrimation By Search",
            data: response.rows,
            dataCount: response.count,
          })
        }

        if (
          Number(PaymentStatusId) &&
          Number(OrderStatusId) &&
          Number(WarehouseId) &&
          payment_method
        ) {
          const response = await db.Transaction.findAndCountAll({
            limit: Number(_limit),
            offset: (_page - 1) * _limit,
            order: [[_sortBy, _sortDir]],
            where: {
              transaction_name: {
                [Op.like]: `%${transaction_name}%`,
              },
              [Op.and]: {
                payment_method,
                PaymentStatusId,
                OrderStatusId,
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
            message: "Waiting Confrimation And",
            data: response.rows,
            dataCount: response.count,
          })
        }

        if (
          Number(OrderStatusId) &&
          Number(PaymentStatusId) &&
          payment_method
        ) {
          const response = await db.Transaction.findAndCountAll({
            limit: Number(_limit),
            offset: (_page - 1) * _limit,
            order: [[_sortBy, _sortDir]],
            where: {
              transaction_name: {
                [Op.like]: `%${transaction_name}%`,
              },
              [Op.and]: {
                payment_method,
                PaymentStatusId,
                OrderStatusId,
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
            message: "Waiting Confrimation And",
            data: response.rows,
            dataCount: response.count,
          })
        }

        if (
          Number(OrderStatusId) &&
          Number(PaymentStatusId) &&
          Number(WarehouseId)
        ) {
          const response = await db.Transaction.findAndCountAll({
            limit: Number(_limit),
            offset: (_page - 1) * _limit,
            order: [[_sortBy, _sortDir]],
            where: {
              transaction_name: {
                [Op.like]: `%${transaction_name}%`,
              },
              [Op.and]: {
                WarehouseId,
                PaymentStatusId,
                OrderStatusId,
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
            message: "Waiting Confrimation And",
            data: response.rows,
            dataCount: response.count,
          })
        }

        if (Number(OrderStatusId) && Number(WarehouseId) && payment_method) {
          const response = await db.Transaction.findAndCountAll({
            limit: Number(_limit),
            offset: (_page - 1) * _limit,
            order: [[_sortBy, _sortDir]],
            where: {
              transaction_name: {
                [Op.like]: `%${transaction_name}%`,
              },
              [Op.and]: {
                payment_method,
                WarehouseId,
                OrderStatusId,
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
            message: "Waiting Confrimation And",
            data: response.rows,
            dataCount: response.count,
          })
        }

        if (Number(WarehouseId) && Number(PaymentStatusId) && payment_method) {
          const response = await db.Transaction.findAndCountAll({
            limit: Number(_limit),
            offset: (_page - 1) * _limit,
            order: [[_sortBy, _sortDir]],
            where: {
              transaction_name: {
                [Op.like]: `%${transaction_name}%`,
              },
              [Op.and]: {
                WarehouseId,
                PaymentStatusId,
                payment_method,
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
            message: "Waiting Confrimation And",
            data: response.rows,
            dataCount: response.count,
          })
        }

        if (Number(PaymentStatusId) && Number(OrderStatusId)) {
          const response = await db.Transaction.findAndCountAll({
            limit: Number(_limit),
            offset: (_page - 1) * _limit,
            order: [[_sortBy, _sortDir]],
            where: {
              transaction_name: {
                [Op.like]: `%${transaction_name}%`,
              },
              [Op.and]: {
                PaymentStatusId,
                OrderStatusId,
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
            message: "Waiting Confrimation And atas bet",
            data: response.rows,
            dataCount: response.count,
          })
        }

        if (payment_method && Number(OrderStatusId)) {
          const response = await db.Transaction.findAndCountAll({
            limit: Number(_limit),
            offset: (_page - 1) * _limit,
            order: [[_sortBy, _sortDir]],
            where: {
              transaction_name: {
                [Op.like]: `%${transaction_name}%`,
              },
              [Op.and]: {
                payment_method,
                OrderStatusId,
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
            message: "Waiting Confrimation And",
            data: response.rows,
            dataCount: response.count,
          })
        }

        if (Number(PaymentStatusId) && payment_method) {
          const response = await db.Transaction.findAndCountAll({
            limit: Number(_limit),
            offset: (_page - 1) * _limit,
            order: [[_sortBy, _sortDir]],
            where: {
              transaction_name: {
                [Op.like]: `%${transaction_name}%`,
              },
              [Op.and]: {
                payment_method,
                PaymentStatusId,
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
            message: "Waiting Confrimation And",
            data: response.rows,
            dataCount: response.count,
          })
        }

        if (Number(PaymentStatusId) && Number(WarehouseId)) {
          const response = await db.Transaction.findAndCountAll({
            limit: Number(_limit),
            offset: (_page - 1) * _limit,
            order: [[_sortBy, _sortDir]],
            where: {
              transaction_name: {
                [Op.like]: `%${transaction_name}%`,
              },
              [Op.and]: {
                PaymentStatusId,
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
            message: "Waiting Confrimation And 1",
            data: response.rows,
            dataCount: response.count,
          })
        }

        if (Number(WarehouseId) && Number(OrderStatusId)) {
          const response = await db.Transaction.findAndCountAll({
            limit: Number(_limit),
            offset: (_page - 1) * _limit,
            order: [[_sortBy, _sortDir]],
            where: {
              transaction_name: {
                [Op.like]: `%${transaction_name}%`,
              },
              [Op.and]: {
                WarehouseId,
                OrderStatusId,
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
            message: "Waiting Confrimation And 2",
            data: response.rows,
            dataCount: response.count,
          })
        }

        if (Number(WarehouseId) && payment_method) {
          const response = await db.Transaction.findAndCountAll({
            limit: Number(_limit),
            offset: (_page - 1) * _limit,
            order: [[_sortBy, _sortDir]],
            where: {
              transaction_name: {
                [Op.like]: `%${transaction_name}%`,
              },
              [Op.and]: {
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
            message: "Waiting Confrimation And 3",
            data: response.rows,
            dataCount: response.count,
          })
        }

        if (Number(PaymentStatusId) && Number(WarehouseId)) {
          const response = await db.Transaction.findAndCountAll({
            limit: Number(_limit),
            offset: (_page - 1) * _limit,
            order: [[_sortBy, _sortDir]],
            where: {
              transaction_name: {
                [Op.like]: `%${transaction_name}%`,
              },
              [Op.and]: {
                PaymentStatusId,
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
            message: "Waiting Confrimation And 1",
            data: response.rows,
            dataCount: response.count,
          })
        }

        if (Number(WarehouseId) && Number(OrderStatusId)) {
          const response = await db.Transaction.findAndCountAll({
            limit: Number(_limit),
            offset: (_page - 1) * _limit,
            order: [[_sortBy, _sortDir]],
            where: {
              transaction_name: {
                [Op.like]: `%${transaction_name}%`,
              },
              [Op.and]: {
                WarehouseId,
                OrderStatusId,
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
            message: "Waiting Confrimation And 2",
            data: response.rows,
            dataCount: response.count,
          })
        }

        if (Number(WarehouseId) && payment_method) {
          const response = await db.Transaction.findAndCountAll({
            limit: Number(_limit),
            offset: (_page - 1) * _limit,
            order: [[_sortBy, _sortDir]],
            where: {
              transaction_name: {
                [Op.like]: `%${transaction_name}%`,
              },
              [Op.and]: {
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
            message: "Waiting Confrimation And 3",
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

      // Jurnal Function
      // const addOrAdd = (stock_before, stock_after) => {
      //   const count = Math.max(stock_before, stock_after)
      //   if (count === stock_before) {
      //     return false
      //   } else {
      //     return true
      //   }
      // }

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

      // Find items on Transaction
      const findItems = await db.TransactionItem.findAll({
        where: {
          TransactionId: id,
        },
      })

      const transactionItemId = findItems.map((val) => val.id)
      const productId = findItems.map((val) => val.ProductId)
      const quantity = findItems.map((val) => val.quantity)

      // Make item to an Object
      const reqstock = quantity.map((val, i) => {
        return {
          id: transactionItemId[i],
          productId: productId[i],
          stock: val,
        }
      })

      // Find item stock by ProductId and warehouseId from transaction
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

      // find items that are less than the total stock
      const arr = []
      for (let i = 0; i < totalStock.length; i++) {
        let result = 0
        result = totalStock[i] - quantity[i]
        arr.push(result)
      }

      // Make an object
      const arr1 = arr.map((val, i) => {
        return {
          transactionItemId: transactionItemId[i],
          productId: productId[i],
          quantity: quantity[i],
          stock: val,
        }
      })

      const stockMutation = arr1.filter((val) => {
        return val.stock < 0
      })

      const selisih = stockMutation.map((val) => val.stock * -1)

      const ProductMutationId = stockMutation.map((val) => val.productId)

      const findTransactionItem = stockMutation.map(
        (val) => val.transactionItemId
      )

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
      const tempDist = []
      for (var i = 0; i < findClosestWarehouse.length; i++) {
        const tempNum = calcCrow(
          findTransaction.Warehouse.latitude,
          findClosestWarehouse[i].latitude,
          findTransaction.Warehouse.longitude,
          findClosestWarehouse[i].longitude
        )
        tempDist.push(tempNum)
        chooseOne.push({
          warehouse: findClosestWarehouse[i],
          distance: tempNum,
        })
      }
      const minDist = Math.min(...tempDist)
      const sortDist = chooseOne.sort((a, b) => a.distance - b.distance)
      const closestCity = sortDist.filter((x) => x.distance == minDist)
      const palingDeket = closestCity
        .map((val) => val.warehouse.id)
        .filter((val) => val != findTransaction.WarehouseId)

      const minusStock = []
      for (let i = 0; i < ProductMutationId.length; i++) {
        const findTotalStockProduct = await db.Total_Stock.findAll({
          where: {
            WarehouseId: palingDeket[0],
            ProductId: ProductMutationId[i],
          },
        })

        minusStock.push(
          findTotalStockProduct.map((val) => val.stock - selisih[i])
        )
      }

      const plushStock = []
      for (let i = 0; i < ProductMutationId.length; i++) {
        const findTotalStockProduct = await db.Total_Stock.findAll({
          where: {
            WarehouseId: findTransaction.WarehouseId,
            ProductId: ProductMutationId[i],
          },
        })

        plushStock.push(
          findTotalStockProduct.map((val) => val.stock + selisih[i])
        )
      }

      for (let i = 0; i < findTransactionItem.length; i++) {
        await db.Mutation.create({
          from_warehouse: findTransaction.WarehouseId,
          to_warehouse: palingDeket[0],
          quantity: selisih[i],
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
              WarehouseId: palingDeket[0],
              ProductId: ProductMutationId[i],
            },
          }
        )
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
      }

      const finalStock = []
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
      }

      // const journal = await db.Type_Journal.create({
      //   name: "Mutation Stock",
      //   type: addOrAdd(stock_before, stock_after),
      //   stock_after: findData.dataValues.stock,
      //   ProductId: findData.ProductId,
      // })

      // const findTypeId = await db.Type_Journal.findByPk(journal.id)

      // await db.Journal.create({
      //   stock_before: findBeforeStock.dataValues.stock,
      //   stock_after: findData.dataValues.stock,
      //   ProductId: findData.ProductId,
      //   TypeJournalId: findTypeId.dataValues.id,
      // })

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

      const findTransactionList = await db.Transaction.findOne({
        where: {
          id: id,
        },
      })

      if (!findTransactionList) {
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

      const findTransaction = await db.Transaction.findOne({
        where: {
          id: id,
        },
        include: [{ model: db.User }],
      })

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

      schedule

      const dueDateConfirm = moment()
        .add(7, "days")
        .format("YYYY-MM-DD HH:mm:ss")

      schedule.scheduleJob(
        dueDateConfirm,
        async () =>
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
      )

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
}

module.exports = adminOrderController
