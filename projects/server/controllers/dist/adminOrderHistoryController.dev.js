"use strict";

var db = require("../models");

var _require = require("sequelize"),
    Op = _require.Op;

var _require2 = require("../models"),
    sequelize = _require2.sequelize;

var Transaction = db.Transaction;
var TransactionItem = db.TransactionItem;
var Warehouse = db.Warehouse;
var Product = db.Product;
var Total_Stock = db.Total_Stock;
var User = db.User;
var Image_Url = db.Image_Url;
var adminOrderHistoryController = {
  getAllOrderHistory: function getAllOrderHistory(req, res) {
    var WarehouseId, _req$query, createdAt, _req$query$transactio, transaction_name, _req$query$_limit, _limit, _req$query$_page, _page, _req$query$_sortBy, _sortBy, _req$query$_sortDir, _sortDir, sql, findData, getTransactionId, dataCount, transactionList;

    return regeneratorRuntime.async(function getAllOrderHistory$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            WarehouseId = req.query.WarehouseId[0];
            _req$query = req.query, createdAt = _req$query.createdAt, _req$query$transactio = _req$query.transaction_name, transaction_name = _req$query$transactio === void 0 ? "" : _req$query$transactio, _req$query$_limit = _req$query._limit, _limit = _req$query$_limit === void 0 ? 10 : _req$query$_limit, _req$query$_page = _req$query._page, _page = _req$query$_page === void 0 ? 1 : _req$query$_page, _req$query$_sortBy = _req$query._sortBy, _sortBy = _req$query$_sortBy === void 0 ? "id" : _req$query$_sortBy, _req$query$_sortDir = _req$query._sortDir, _sortDir = _req$query$_sortDir === void 0 ? "DESC" : _req$query$_sortDir;
            _context.prev = 2;
            sql = "SELECT  trx.id AS TransactionId,  trx.WarehouseId, wr.warehouse_name, trx.createdAt\n                        FROM transactionitems AS trx_items\n                        JOIN products AS pr ON pr.id = trx_items.ProductId\n                        JOIN transactions AS trx ON trx.id = trx_items.TransactionId\n                        JOIN warehouses as wr ON wr.id = trx.WarehouseId ";

            if (WarehouseId && createdAt && transaction_name) {
              sql += "WHERE WarehouseId=".concat(WarehouseId, " AND MONTH(trx.createdAt)=").concat(createdAt, " AND trx.transaction_name LIKE \"%").concat(transaction_name, "%\" ");
            } else if (WarehouseId && transaction_name) {
              sql += "WHERE WarehouseId=".concat(WarehouseId, " AND trx.transaction_name LIKE \"%").concat(transaction_name, "%\"  ");
            } else if (WarehouseId && createdAt) {
              sql += "WHERE WarehouseId=".concat(WarehouseId, " AND MONTH(trx.createdAt)=").concat(createdAt, " ");
            } else if (createdAt && transaction_name) {
              sql += "WHERE MONTH(trx.createdAt)=".concat(createdAt, " AND trx.transaction_name LIKE \"%").concat(transaction_name, "%\" ");
            } else if (WarehouseId) {
              sql += "WHERE WarehouseId=".concat(WarehouseId, " ");
            } else if (createdAt) {
              sql += "WHERE MONTH(trx.createdAt)=".concat(createdAt, " ");
            } else if (transaction_name) {
              sql += "WHERE trx.transaction_name LIKE \"%".concat(transaction_name, "%\" ");
            }

            _context.next = 7;
            return regeneratorRuntime.awrap(db.sequelize.query(sql += "GROUP BY trx.id "));

          case 7:
            findData = _context.sent;
            getTransactionId = findData[0].map(function (val) {
              return val.TransactionId;
            });
            dataCount = getTransactionId.length;
            _context.next = 12;
            return regeneratorRuntime.awrap(Transaction.findAndCountAll({
              limit: Number(_limit),
              offset: (_page - 1) * _limit,
              order: [[_sortBy, _sortDir]],
              include: [{
                model: TransactionItem,
                include: [{
                  model: Product,
                  include: [{
                    model: Image_Url
                  }, {
                    model: Total_Stock
                  }]
                }]
              }, {
                model: db.Order_status
              }, {
                model: User
              }, {
                model: Warehouse
              }],
              where: {
                id: getTransactionId
              }
            }));

          case 12:
            transactionList = _context.sent;
            return _context.abrupt("return", res.status(200).json({
              message: "Filtered",
              data: transactionList.rows,
              dataCount: dataCount
            }));

          case 16:
            _context.prev = 16;
            _context.t0 = _context["catch"](2);
            return _context.abrupt("return", res.status(500).json({
              message: "Server Error"
            }));

          case 19:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[2, 16]]);
  },
  findWarehouse: function findWarehouse(req, res) {
    var response;
    return regeneratorRuntime.async(function findWarehouse$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return regeneratorRuntime.awrap(db.Warehouse.findAll());

          case 3:
            response = _context2.sent;
            return _context2.abrupt("return", res.status(200).json({
              message: "Find all warehouse",
              data: response
            }));

          case 7:
            _context2.prev = 7;
            _context2.t0 = _context2["catch"](0);
            return _context2.abrupt("return", res.status(500).json({
              message: "Server Error"
            }));

          case 10:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[0, 7]]);
  }
};
module.exports = adminOrderHistoryController;