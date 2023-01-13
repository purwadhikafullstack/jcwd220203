"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var db = require("../models");

var User = db.User;

var bcrypt = require("bcrypt");

var _require = require("sequelize"),
    Op = _require.Op;

var userDataController = {
  getAllUser: function getAllUser(req, res) {
    var findAdminById, _req$query, _req$query$username, username, _req$query$_sortBy, _sortBy, _req$query$_sortDir, _sortDir, _req$query$_limit, _limit, _req$query$_page, _page, _findUser, findUser;

    return regeneratorRuntime.async(function getAllUser$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return regeneratorRuntime.awrap(db.User.findByPk(req.user.id));

          case 3:
            findAdminById = _context.sent;

            if (!(findAdminById.RoleId !== 3)) {
              _context.next = 6;
              break;
            }

            return _context.abrupt("return", res.status(400).json({
              message: "User unauthorized"
            }));

          case 6:
            _req$query = req.query, _req$query$username = _req$query.username, username = _req$query$username === void 0 ? "" : _req$query$username, _req$query$_sortBy = _req$query._sortBy, _sortBy = _req$query$_sortBy === void 0 ? "username" : _req$query$_sortBy, _req$query$_sortDir = _req$query._sortDir, _sortDir = _req$query$_sortDir === void 0 ? "ASC" : _req$query$_sortDir, _req$query$_limit = _req$query._limit, _limit = _req$query$_limit === void 0 ? 6 : _req$query$_limit, _req$query$_page = _req$query._page, _page = _req$query$_page === void 0 ? 1 : _req$query$_page;

            if (!(_sortBy === "username" || _sortBy === "createdAt" || username)) {
              _context.next = 12;
              break;
            }

            _context.next = 10;
            return regeneratorRuntime.awrap(db.User.findAndCountAll({
              limit: Number(_limit),
              offset: (_page - 1) * _limit,
              order: [[_sortBy, _sortDir]],
              where: {
                is_verify: 1,
                RoleId: 1,
                username: _defineProperty({}, Op.like, "%".concat(username, "%"))
              },
              include: [{
                model: db.Role
              }, {
                model: db.Address
              }]
            }));

          case 10:
            _findUser = _context.sent;
            return _context.abrupt("return", res.status(200).json({
              message: "Find User by Name",
              data: _findUser.rows,
              dataCount: _findUser.count
            }));

          case 12:
            _context.next = 14;
            return regeneratorRuntime.awrap(db.User.findAndCountAll({
              limit: Number(_limit),
              offset: (_page - 1) * _limit,
              order: [[_sortBy, _sortDir]],
              where: {
                is_verify: 1,
                RoleId: 1,
                username: _defineProperty({}, Op.like, "%".concat(username, "%"))
              },
              include: [{
                model: db.Role
              }, {
                model: db.Address
              }]
            }));

          case 14:
            findUser = _context.sent;
            return _context.abrupt("return", res.status(200).json({
              message: "Find All User Data",
              data: findUser.rows,
              dataCount: findUser.count
            }));

          case 18:
            _context.prev = 18;
            _context.t0 = _context["catch"](0);
            console.log(_context.t0);
            return _context.abrupt("return", res.status(500).json({
              message: "Sever Error"
            }));

          case 22:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[0, 18]]);
  },
  getAllWarehouseAdmin: function getAllWarehouseAdmin(req, res) {
    var findAdminById, _req$query2, _req$query2$username, username, _req$query2$_sortBy, _sortBy, _req$query2$_sortDir, _sortDir, _req$query2$_limit, _limit, _req$query2$_page, _page, _findUser2, findUser;

    return regeneratorRuntime.async(function getAllWarehouseAdmin$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return regeneratorRuntime.awrap(db.User.findByPk(req.user.id));

          case 3:
            findAdminById = _context2.sent;

            if (!(findAdminById.RoleId !== 3)) {
              _context2.next = 6;
              break;
            }

            return _context2.abrupt("return", res.status(400).json({
              message: "User unauthorized"
            }));

          case 6:
            _req$query2 = req.query, _req$query2$username = _req$query2.username, username = _req$query2$username === void 0 ? "" : _req$query2$username, _req$query2$_sortBy = _req$query2._sortBy, _sortBy = _req$query2$_sortBy === void 0 ? "username" : _req$query2$_sortBy, _req$query2$_sortDir = _req$query2._sortDir, _sortDir = _req$query2$_sortDir === void 0 ? "ASC" : _req$query2$_sortDir, _req$query2$_limit = _req$query2._limit, _limit = _req$query2$_limit === void 0 ? 6 : _req$query2$_limit, _req$query2$_page = _req$query2._page, _page = _req$query2$_page === void 0 ? 1 : _req$query2$_page;

            if (!(_sortBy === "username" || _sortBy === "createdAt" || username)) {
              _context2.next = 12;
              break;
            }

            _context2.next = 10;
            return regeneratorRuntime.awrap(db.User.findAndCountAll({
              limit: Number(_limit),
              offset: (_page - 1) * _limit,
              order: [[_sortBy, _sortDir]],
              where: {
                RoleId: 2,
                username: _defineProperty({}, Op.like, "%".concat(username, "%"))
              },
              include: [{
                model: db.Role
              }, {
                model: db.Warehouse
              }]
            }));

          case 10:
            _findUser2 = _context2.sent;
            return _context2.abrupt("return", res.status(200).json({
              message: "Find Admin by Name",
              data: _findUser2.rows,
              dataCount: _findUser2.count
            }));

          case 12:
            _context2.next = 14;
            return regeneratorRuntime.awrap(db.User.findAndCountAll({
              offset: (_page - 1) * _limit,
              limit: Number(_limit),
              order: [[_sortBy, _sortDir]],
              where: {
                RoleId: 2
              },
              include: [{
                model: db.Role
              }, {
                model: db.Warehouse
              }]
            }));

          case 14:
            findUser = _context2.sent;
            return _context2.abrupt("return", res.status(200).json({
              message: "Find All Admin Data",
              data: findUser.rows,
              dataCount: findUser.count
            }));

          case 18:
            _context2.prev = 18;
            _context2.t0 = _context2["catch"](0);
            console.log(_context2.t0);
            return _context2.abrupt("return", res.status(500).json({
              message: "Sever Error"
            }));

          case 22:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[0, 18]]);
  },
  addNewAdmin: function addNewAdmin(req, res) {
    var findAdminById, profile_picture, _req$body, email, password, phone_number, username, WarehouseId, findEmail, findPhoneNumber, hashedPassword, newUser;

    return regeneratorRuntime.async(function addNewAdmin$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return regeneratorRuntime.awrap(db.User.findByPk(req.user.id));

          case 3:
            findAdminById = _context3.sent;

            if (!(findAdminById.RoleId !== 3)) {
              _context3.next = 6;
              break;
            }

            return _context3.abrupt("return", res.status(400).json({
              message: "User unauthorized"
            }));

          case 6:
            profile_picture = req.file.filename;
            _req$body = req.body, email = _req$body.email, password = _req$body.password, phone_number = _req$body.phone_number, username = _req$body.username, WarehouseId = _req$body.WarehouseId;
            _context3.next = 10;
            return regeneratorRuntime.awrap(db.User.findOne({
              where: {
                email: email
              }
            }));

          case 10:
            findEmail = _context3.sent;

            if (!findEmail) {
              _context3.next = 13;
              break;
            }

            return _context3.abrupt("return", res.status(400).json({
              message: "Email has been used"
            }));

          case 13:
            _context3.next = 15;
            return regeneratorRuntime.awrap(db.User.findOne({
              where: {
                phone_number: phone_number
              }
            }));

          case 15:
            findPhoneNumber = _context3.sent;

            if (!findPhoneNumber) {
              _context3.next = 18;
              break;
            }

            return _context3.abrupt("return", res.status(400).json({
              message: "Phone number has been used"
            }));

          case 18:
            hashedPassword = bcrypt.hashSync(password, 5);
            _context3.next = 21;
            return regeneratorRuntime.awrap(db.User.create(_defineProperty({
              email: email,
              password: hashedPassword,
              username: username,
              profile_picture: profile_picture,
              phone_number: phone_number,
              WarehouseId: WarehouseId,
              is_verify: true,
              RoleId: 2
            }, "WarehouseId", WarehouseId)));

          case 21:
            newUser = _context3.sent;
            return _context3.abrupt("return", res.status(200).json({
              message: "Admin Registered",
              data: newUser
            }));

          case 25:
            _context3.prev = 25;
            _context3.t0 = _context3["catch"](0);
            console.log(_context3.t0);
            return _context3.abrupt("return", res.status(500).json({
              message: "Server Error"
            }));

          case 29:
          case "end":
            return _context3.stop();
        }
      }
    }, null, null, [[0, 25]]);
  },
  updateAdmin: function updateAdmin(req, res) {
    var findAdminById, _req$body2, phone_number, profile_picture, username, WarehouseId, id, findData;

    return regeneratorRuntime.async(function updateAdmin$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return regeneratorRuntime.awrap(db.User.findByPk(req.user.id));

          case 3:
            findAdminById = _context4.sent;

            if (!(findAdminById.RoleId !== 3)) {
              _context4.next = 6;
              break;
            }

            return _context4.abrupt("return", res.status(400).json({
              message: "User unauthorized"
            }));

          case 6:
            if (req.file) {
              req.body.profile_picture = req.file.filename;
            }

            _req$body2 = req.body, phone_number = _req$body2.phone_number, profile_picture = _req$body2.profile_picture, username = _req$body2.username, WarehouseId = _req$body2.WarehouseId;
            id = req.params.id;
            _context4.next = 11;
            return regeneratorRuntime.awrap(db.User.update({
              phone_number: phone_number,
              profile_picture: profile_picture,
              username: username,
              WarehouseId: WarehouseId
            }, {
              where: {
                id: id
              }
            }));

          case 11:
            _context4.next = 13;
            return regeneratorRuntime.awrap(db.User.findByPk(id));

          case 13:
            findData = _context4.sent;
            return _context4.abrupt("return", res.status(200).json({
              message: "Admin Edited",
              data: findData
            }));

          case 17:
            _context4.prev = 17;
            _context4.t0 = _context4["catch"](0);
            console.log(_context4.t0);
            return _context4.abrupt("return", res.status(500).json({
              message: "Server Error"
            }));

          case 21:
          case "end":
            return _context4.stop();
        }
      }
    }, null, null, [[0, 17]]);
  },
  deleteAdmin: function deleteAdmin(req, res) {
    var findAdminById, id;
    return regeneratorRuntime.async(function deleteAdmin$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            _context5.next = 3;
            return regeneratorRuntime.awrap(db.User.findByPk(req.user.id));

          case 3:
            findAdminById = _context5.sent;

            if (!(findAdminById.RoleId !== 3)) {
              _context5.next = 6;
              break;
            }

            return _context5.abrupt("return", res.status(400).json({
              message: "User unauthorized"
            }));

          case 6:
            id = req.params.id;
            _context5.next = 9;
            return regeneratorRuntime.awrap(db.User.destroy({
              where: {
                id: id
              }
            }));

          case 9:
            return _context5.abrupt("return", res.status(200).json({
              message: "Admin Deleted"
            }));

          case 12:
            _context5.prev = 12;
            _context5.t0 = _context5["catch"](0);
            console.log(_context5.t0);
            return _context5.abrupt("return", res.status(500).json({
              message: "Server Error"
            }));

          case 16:
          case "end":
            return _context5.stop();
        }
      }
    }, null, null, [[0, 12]]);
  },
  findAllWarehouse: function findAllWarehouse(req, res) {
    var findAdminById, response;
    return regeneratorRuntime.async(function findAllWarehouse$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            _context6.next = 3;
            return regeneratorRuntime.awrap(db.User.findByPk(req.user.id));

          case 3:
            findAdminById = _context6.sent;

            if (!(findAdminById.RoleId !== 3)) {
              _context6.next = 6;
              break;
            }

            return _context6.abrupt("return", res.status(400).json({
              message: "User unauthorized"
            }));

          case 6:
            _context6.next = 8;
            return regeneratorRuntime.awrap(db.Warehouse.findAll({// include: [{ model: db.User }],
            }));

          case 8:
            response = _context6.sent;
            return _context6.abrupt("return", res.status(200).json({
              message: "Find All Warehouse",
              data: response
            }));

          case 12:
            _context6.prev = 12;
            _context6.t0 = _context6["catch"](0);
            console.log(_context6.t0);
            return _context6.abrupt("return", res.status(500).json({
              message: "Server Error"
            }));

          case 16:
          case "end":
            return _context6.stop();
        }
      }
    }, null, null, [[0, 12]]);
  }
};
module.exports = userDataController;