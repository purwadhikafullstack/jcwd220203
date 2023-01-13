"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = require("sequelize"),
    Op = _require.Op;

var db = require("../models");

var Product = db.Product;
var Image_Url = db.Image_Url;
var Category = db.Category;
var Total_Stock = db.Total_Stock;
var productController = {
  getAllProduct: function getAllProduct(req, res) {
    var _req$query, _req$query$category_n, category_name, _req$query$product_na, product_name, _req$query$CategoryId, CategoryId, _req$query$_sortBy, _sortBy, _req$query$_sortDir, _sortDir, _req$query$_limit, _limit, _req$query$_page, _page, _where2, getAllProducts1, getAllProducts2, getAllProducts3;

    return regeneratorRuntime.async(function getAllProduct$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _req$query = req.query, _req$query$category_n = _req$query.category_name, category_name = _req$query$category_n === void 0 ? "" : _req$query$category_n, _req$query$product_na = _req$query.product_name, product_name = _req$query$product_na === void 0 ? "" : _req$query$product_na, _req$query$CategoryId = _req$query.CategoryId, CategoryId = _req$query$CategoryId === void 0 ? "" : _req$query$CategoryId, _req$query$_sortBy = _req$query._sortBy, _sortBy = _req$query$_sortBy === void 0 ? "id" : _req$query$_sortBy, _req$query$_sortDir = _req$query._sortDir, _sortDir = _req$query$_sortDir === void 0 ? "ASC" : _req$query$_sortDir, _req$query$_limit = _req$query._limit, _limit = _req$query$_limit === void 0 ? 12 : _req$query$_limit, _req$query$_page = _req$query._page, _page = _req$query$_page === void 0 ? 1 : _req$query$_page;

            if (!CategoryId) {
              _context.next = 12;
              break;
            }

            if (Number(CategoryId)) {
              _context.next = 8;
              break;
            }

            _context.next = 6;
            return regeneratorRuntime.awrap(Product.findAndCountAll({
              limit: Number(_limit),
              offset: (_page - 1) * _limit,
              include: [{
                model: Category,
                required: true
              }, {
                model: Image_Url
              }],
              order: [[_sortBy, _sortDir]],
              where: _defineProperty({}, Op.or, {
                product_name: _defineProperty({}, Op.like, "%".concat(product_name, "%")),
                "$Category.category_name$": _defineProperty({}, Op.like, "%".concat(category_name, "%"))
              })
            }));

          case 6:
            getAllProducts1 = _context.sent;
            return _context.abrupt("return", res.status(200).json({
              message: "Get all products",
              data: getAllProducts1.rows,
              dataCount: getAllProducts1.count
            }));

          case 8:
            _context.next = 10;
            return regeneratorRuntime.awrap(Product.findAndCountAll({
              limit: Number(_limit),
              offset: (_page - 1) * _limit,
              include: [{
                model: Category,
                required: true
              }, {
                model: Image_Url
              }],
              order: [[_sortBy, _sortDir]],
              where: (_where2 = {}, _defineProperty(_where2, Op.or, {
                product_name: _defineProperty({}, Op.like, "%".concat(product_name, "%")),
                "$Category.category_name$": _defineProperty({}, Op.like, "%".concat(category_name, "%"))
              }), _defineProperty(_where2, "CategoryId", CategoryId), _where2)
            }));

          case 10:
            getAllProducts2 = _context.sent;
            return _context.abrupt("return", res.status(200).json({
              message: "Get all books",
              data: getAllProducts2.rows,
              dataCount: getAllProducts2.count
            }));

          case 12:
            _context.next = 14;
            return regeneratorRuntime.awrap(Product.findAndCountAll({
              limit: Number(_limit),
              offset: (_page - 1) * _limit,
              include: [{
                model: Category
              }, {
                model: Image_Url
              }],
              order: [[_sortBy, _sortDir], ["price", "DESC"]]
            }));

          case 14:
            getAllProducts3 = _context.sent;
            return _context.abrupt("return", res.status(200).json({
              message: "Get all",
              data: getAllProducts3.rows,
              dataCount: getAllProducts3.count
            }));

          case 18:
            _context.prev = 18;
            _context.t0 = _context["catch"](0);
            console.log(_context.t0);
            return _context.abrupt("return", res.status(500).json({
              message: "Server Error"
            }));

          case 22:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[0, 18]]);
  },
  getProductById: function getProductById(req, res) {
    var id, findProductByPk;
    return regeneratorRuntime.async(function getProductById$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            id = req.params.id;
            _context2.next = 4;
            return regeneratorRuntime.awrap(Product.findByPk(id, {
              include: [{
                model: Category
              }, {
                model: Image_Url
              }, {
                model: Total_Stock
              }]
            }));

          case 4:
            findProductByPk = _context2.sent;
            return _context2.abrupt("return", res.status(200).json({
              message: "Get Products details",
              data: findProductByPk
            }));

          case 8:
            _context2.prev = 8;
            _context2.t0 = _context2["catch"](0);
            console.log(_context2.t0);
            return _context2.abrupt("return", res.status(500).json({
              message: "Server Error"
            }));

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[0, 8]]);
  },
  getImage: function getImage(req, res) {
    var id, findImageById;
    return regeneratorRuntime.async(function getImage$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            id = req.params.id;
            _context3.next = 4;
            return regeneratorRuntime.awrap(Image_Url.findByPk(id));

          case 4:
            findImageById = _context3.sent;
            return _context3.abrupt("return", res.status(200).json({
              message: "Get image by id",
              data: findImageById
            }));

          case 8:
            _context3.prev = 8;
            _context3.t0 = _context3["catch"](0);
            console.log(_context3.t0);
            return _context3.abrupt("return", res.status(500).json({
              message: "Server Error"
            }));

          case 12:
          case "end":
            return _context3.stop();
        }
      }
    }, null, null, [[0, 8]]);
  },
  getCategory: function getCategory(req, res) {
    var _req$query2, _req$query2$_limit, _limit, _req$query2$_page, _page, findCategory, getCategoryId, categoryCount;

    return regeneratorRuntime.async(function getCategory$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _req$query2 = req.query, _req$query2$_limit = _req$query2._limit, _limit = _req$query2$_limit === void 0 ? 50 : _req$query2$_limit, _req$query2$_page = _req$query2._page, _page = _req$query2$_page === void 0 ? 1 : _req$query2$_page;
            _context4.next = 4;
            return regeneratorRuntime.awrap(Category.findAll({
              limit: Number(_limit),
              offset: (_page - 1) * _limit,
              order: [["category_name", "ASC"]]
            }));

          case 4:
            findCategory = _context4.sent;
            getCategoryId = findCategory.map(function (val) {
              return val.id;
            });
            categoryCount = getCategoryId.length;
            return _context4.abrupt("return", res.status(200).json({
              message: "Get category",
              data: findCategory,
              dataCount: findCategory.count,
              categoryCount: categoryCount
            }));

          case 10:
            _context4.prev = 10;
            _context4.t0 = _context4["catch"](0);
            console.log(_context4.t0);
            return _context4.abrupt("return", res.status(200).json({
              message: "Server Error"
            }));

          case 14:
          case "end":
            return _context4.stop();
        }
      }
    }, null, null, [[0, 10]]);
  },
  getCategoryId: function getCategoryId(req, res) {
    var id, findCategoryById;
    return regeneratorRuntime.async(function getCategoryId$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            id = req.params.id;
            _context5.next = 4;
            return regeneratorRuntime.awrap(Category.findByPk(id));

          case 4:
            findCategoryById = _context5.sent;
            return _context5.abrupt("return", res.status(200).json({
              message: "Get category",
              data: findCategoryById
            }));

          case 8:
            _context5.prev = 8;
            _context5.t0 = _context5["catch"](0);
            console.log(_context5.t0);
            return _context5.abrupt("return", res.status(200).json({
              message: "Server Error"
            }));

          case 12:
          case "end":
            return _context5.stop();
        }
      }
    }, null, null, [[0, 8]]);
  }
};
module.exports = productController;