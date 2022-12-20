const db = require("../models")
const emailer = require("../lib/emailer")
const fs = require("fs")
const handlebars = require("handlebars")
const { Op } = require("sequelize")
const moment = require("moment")

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
                  where: {
                    id: findAdmin.WarehouseId,
                  },
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
                  where: {
                    id: findAdmin.WarehouseId,
                  },
                },
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
                {
                  model: db.Warehouse,
                  where: {
                    id: findAdmin.WarehouseId,
                  },
                },
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
                  where: {
                    id: findAdmin.WarehouseId,
                  },
                },
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
                {
                  model: db.Warehouse,
                  where: {
                    id: findAdmin.WarehouseId,
                  },
                },
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
              {
                model: db.Warehouse,
                where: {
                  id: findAdmin.WarehouseId,
                },
              },
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
            {
              model: db.Warehouse,
              where: {
                id: findAdmin.WarehouseId,
              },
            },
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
        where: {
          id: id,
        },
      })

      if (!findTransaction) {
        return res.status(400).json({
          message: "Transaction not found",
        })
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

      const findApproveTrasanction = await db.Transaction.findOne({
        where: {
          id: id,
        },
        include: [{ model: db.User }],
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
}

module.exports = adminOrderController
