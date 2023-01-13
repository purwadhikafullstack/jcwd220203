"use strict";

var _require = require("../models"),
    sequelize = _require.sequelize;

var db = require("../models");

var pagination = require("../lib/sales/pagination");

var paginationData = require("../lib/sales/paginationData");

var salesReportController = {
  getReport: function getReport(req, res) {
    var CategoryId, WarehouseId, _req$query, createdAt, _req$query$product_na, product_name, _req$query$category_n, category_name, _req$query$_limit, _limit, _req$query$_page, _page, _req$query$_sortBy, _sortBy, sql, dataCount, dataCountReal, findData, findDataReal;

    return regeneratorRuntime.async(function getReport$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            CategoryId = req.query.CategoryId;
            WarehouseId = req.query.WarehouseId[0];
            _req$query = req.query, createdAt = _req$query.createdAt, _req$query$product_na = _req$query.product_name, product_name = _req$query$product_na === void 0 ? "" : _req$query$product_na, _req$query$category_n = _req$query.category_name, category_name = _req$query$category_n === void 0 ? "" : _req$query$category_n, _req$query$_limit = _req$query._limit, _limit = _req$query$_limit === void 0 ? 10 : _req$query$_limit, _req$query$_page = _req$query._page, _page = _req$query$_page === void 0 ? 1 : _req$query$_page;
            _context.prev = 3;
            _req$query$_sortBy = req.query._sortBy, _sortBy = _req$query$_sortBy === void 0 ? "" : _req$query$_sortBy;
            sql = "SELECT  trx.WarehouseId, pr.CategoryId, pr.id AS productId, ct.category_name, pr.product_name, pr.description, trx_items.price_per_item AS price, trx_items.quantity,\n                        trx_items.price_per_item * trx_items.quantity AS total, wr.warehouse_name, trx_items.createdAt\n                        FROM transactionitems AS trx_items\n                        JOIN transactions AS trx ON trx.id = trx_items.TransactionId\n                        JOIN products AS pr ON pr.id = trx_items.ProductId\n                        JOIN categories AS ct ON ct.id = pr.CategoryId\n                        JOIN warehouses as wr ON wr.id = trx.WarehouseId ";

            if (WarehouseId && CategoryId && createdAt && (product_name || category_name)) {
              sql += "WHERE WarehouseId=".concat(WarehouseId, " AND CategoryId=").concat(CategoryId, " AND MONTH(trx_items.createdAt)=").concat(createdAt, " AND (pr.product_name LIKE \"%").concat(product_name, "%\" OR ct.category_name LIKE \"%").concat(category_name, "%\") ");
            } else if (WarehouseId && CategoryId && (product_name || category_name)) {
              sql += "WHERE WarehouseId=".concat(WarehouseId, " AND CategoryId=").concat(CategoryId, " AND (pr.product_name LIKE \"%").concat(product_name, "%\" OR ct.category_name LIKE \"%").concat(category_name, "%\") ");
            } else if (WarehouseId && createdAt && (product_name || category_name)) {
              sql += "WHERE WarehouseId=".concat(WarehouseId, " AND MONTH(trx_items.createdAt)=").concat(createdAt, " AND (pr.product_name LIKE \"%").concat(product_name, "%\" OR ct.category_name LIKE \"%").concat(category_name, "%\") ");
            } else if (CategoryId && createdAt && (product_name || category_name)) {
              sql += "WHERE CategoryId=".concat(CategoryId, " AND MONTH(trx_items.createdAt)=").concat(createdAt, " AND (pr.product_name LIKE \"%").concat(product_name, "%\" OR ct.category_name LIKE \"%").concat(category_name, "%\") ");
            } else if (CategoryId && (product_name || category_name)) {
              sql += "WHERE CategoryId=".concat(CategoryId, " AND (pr.product_name LIKE \"%").concat(product_name, "%\" OR ct.category_name LIKE \"%").concat(category_name, "%\") ");
            } else if (WarehouseId && (product_name || category_name)) {
              sql += "WHERE WarehouseId=".concat(WarehouseId, " AND (pr.product_name LIKE \"%").concat(product_name, "%\" OR ct.category_name LIKE \"%").concat(category_name, "%\") ");
            } else if (createdAt && (product_name || category_name)) {
              sql += "WHERE MONTH(trx_items.createdAt)=".concat(createdAt, " AND (pr.product_name LIKE \"%").concat(product_name, "%\" OR ct.category_name LIKE \"%").concat(category_name, "%\") ");
            } else if (WarehouseId && CategoryId && createdAt) {
              sql += "WHERE WarehouseId=".concat(WarehouseId, " AND CategoryId=").concat(CategoryId, " AND MONTH(trx_items.createdAt)=").concat(createdAt, " ");
            } else if (WarehouseId && CategoryId) {
              sql += "WHERE WarehouseId=".concat(WarehouseId, " AND CategoryId=").concat(CategoryId, " ");
            } else if (WarehouseId && createdAt) {
              sql += "WHERE WarehouseId=".concat(WarehouseId, " AND MONTH(trx_items.createdAt)=").concat(createdAt, " ");
            } else if (CategoryId && createdAt) {
              sql += "WHERE CategoryId=".concat(CategoryId, " AND MONTH(trx_items.createdAt)=").concat(createdAt, " ");
            } else if (product_name || category_name) {
              sql += "WHERE pr.product_name LIKE \"%".concat(product_name, "%\" OR ct.category_name LIKE \"%").concat(category_name, "%\" ");
            } else if (CategoryId) {
              sql += "WHERE CategoryId=".concat(CategoryId, " ");
            } else if (WarehouseId) {
              sql += "WHERE WarehouseId=".concat(WarehouseId, " ");
            } else if (createdAt) {
              sql += "WHERE MONTH(trx_items.createdAt)=".concat(createdAt, " ");
            }

            _context.next = 9;
            return regeneratorRuntime.awrap(db.sequelize.query(sql));

          case 9:
            dataCount = _context.sent;
            dataCountReal = dataCount[0];
            sql += "ORDER BY trx_items.createdAt ".concat(_sortBy, "\n                    LIMIT ").concat(_limit, "\n                    OFFSET ").concat((_page - 1) * _limit, " ");
            _context.next = 14;
            return regeneratorRuntime.awrap(db.sequelize.query(sql));

          case 14:
            findData = _context.sent;
            findDataReal = findData[0];
            return _context.abrupt("return", res.status(200).json({
              message: "Filtered",
              data: findDataReal,
              dataCount: dataCountReal.length
            }));

          case 19:
            _context.prev = 19;
            _context.t0 = _context["catch"](3);
            return _context.abrupt("return", res.status(500).json({
              message: "Server Error"
            }));

          case 22:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[3, 19]]);
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
module.exports = salesReportController;