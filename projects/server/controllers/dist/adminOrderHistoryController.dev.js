"use strict";

var db = require("../models");

var _require = require("sequelize"),
    Op = _require.Op;

var _require2 = require("../models"),
    sequelize = _require2.sequelize;

var Transaction = db.Transaction;
var Transaction_Item = db.TransactionItem;
var Warehouse = db.Warehouse;
var Product = db.Product;
var Total_Stock = db.Total_Stock;
var User = db.User;
var Order_status = db.Order_status;
var adminOrderHistoryController = {
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
  getOrder: function getOrder(req, res) {
    var _req$query, _req$query$_limit, _limit, _req$query$_page, _page, WarehouseId, query, test, test0, transformArr;

    return regeneratorRuntime.async(function getOrder$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _req$query = req.query, _req$query$_limit = _req$query._limit, _limit = _req$query$_limit === void 0 ? 10 : _req$query$_limit, _req$query$_page = _req$query._page, _page = _req$query$_page === void 0 ? 1 : _req$query$_page;
            WarehouseId = req.query.WarehouseId[0];
            console.log(req.query);
            _context.prev = 3;
            query = "SELECT wr.id as warehouse_id,ts.WarehouseId,trx_items.TransactionId,trx.transaction_name, \n            us.username, trx.createdAt, trx.total_quantity, trx.total_price, ps.payment_status_name as order_status, wr.warehouse_name,pr.id as productId                      \n                        FROM transactions as trx\n                        JOIN users as us ON us.id = trx.UserId\n                        JOIN transactionitems as trx_items ON trx_items.TransactionId = trx.id\n                        JOIN products as pr ON pr.id = trx_items.ProductId\n                        JOIN total_stocks as ts ON ts.ProductId = pr.id\n                        JOIN warehouses as wr ON wr.id = ts.WarehouseId\n                        JOIN payment_statuses as ps ON ps.id = trx.PaymentStatusId ";

            if (WarehouseId) {
              query += "WHERE wr.id = ".concat(WarehouseId, " ");
            }

            query += "ORDER BY trx_items.TransactionId DESC\n                    LIMIT ".concat(_limit, "\n                    OFFSET ").concat((_page - 1) * _limit, " ");
            _context.next = 9;
            return regeneratorRuntime.awrap(db.sequelize.query(query));

          case 9:
            test = _context.sent;
            test0 = test[0];

            transformArr = function transformArr(orig) {
              var newArr = [],
                  types = {},
                  i,
                  j,
                  cur;

              for (i = 0, j = orig.length; i < j; i++) {
                cur = orig[i];

                if (!(cur.TransactionId in types)) {
                  types[cur.TransactionId] = {
                    TransactionId: cur.TransactionId,
                    product_names: [],
                    prices: [],
                    qtys: [],
                    descriptions: [],
                    productIds: [],
                    usernames: []
                  };
                  newArr.push(types[cur.TransactionId]);
                }

                types[cur.TransactionId].product_names.push(cur.product_name);
                types[cur.TransactionId].prices.push(cur.price);
                types[cur.TransactionId].qtys.push(cur.qty);
                types[cur.TransactionId].descriptions.push(cur.description);
                types[cur.TransactionId].productIds.push(cur.productId);
                types[cur.TransactionId].usernames.push(cur.username);
              }

              return newArr;
            };

            return _context.abrupt("return", res.status(200).json({
              message: "Filtered",
              data: test0 // dataCount: 5,

            }));

          case 15:
            _context.prev = 15;
            _context.t0 = _context["catch"](3);
            return _context.abrupt("return", res.status(500).json({
              message: _context.t0.message
            }));

          case 18:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[3, 15]]);
  },
  getByWarehouseId: function getByWarehouseId(req, res) {
    var _req$query2, WarehouseId, _req$query2$_limit, _limit, _req$query2$_page, _page, test2, test3;

    return regeneratorRuntime.async(function getByWarehouseId$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _req$query2 = req.query, WarehouseId = _req$query2.WarehouseId, _req$query2$_limit = _req$query2._limit, _limit = _req$query2$_limit === void 0 ? 10 : _req$query2$_limit, _req$query2$_page = _req$query2._page, _page = _req$query2$_page === void 0 ? 1 : _req$query2$_page;

            if (!WarehouseId) {
              _context2.next = 7;
              break;
            }

            _context2.next = 5;
            return regeneratorRuntime.awrap(Transaction.findAndCountAll({
              include: [{
                model: Transaction_Item,
                include: [{
                  model: Product
                }]
              }, {
                model: Warehouse
              }, {
                model: User
              }, {
                model: Order_status
              }],
              where: {
                WarehouseId: WarehouseId
              },
              limit: Number(_limit),
              offset: (_page - 1) * _limit,
              order: [["createdAt", "DESC"]]
            }));

          case 5:
            test2 = _context2.sent;
            return _context2.abrupt("return", res.status(200).json({
              message: "All",
              data: test2.rows,
              dataCount: test2.count
            }));

          case 7:
            _context2.next = 9;
            return regeneratorRuntime.awrap(Transaction.findAndCountAll({
              include: [{
                model: Transaction_Item,
                include: [{
                  model: Product
                }]
              }, {
                model: Warehouse
              }, {
                model: User
              }, {
                model: Order_status
              }],
              limit: Number(_limit),
              offset: (_page - 1) * _limit,
              order: [["createdAt", "DESC"]]
            }));

          case 9:
            test3 = _context2.sent;
            return _context2.abrupt("return", res.status(200).json({
              message: "All",
              data: test3.rows,
              dataCount: test3.count
            }));

          case 13:
            _context2.prev = 13;
            _context2.t0 = _context2["catch"](0);
            return _context2.abrupt("return", res.status(500).json({
              message: _context2.t0.message
            }));

          case 16:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[0, 13]]);
  }
};
module.exports = adminOrderHistoryController;