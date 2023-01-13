"use strict";

var db = require("../models");

var _require = require("sequelize"),
    Op = _require.Op;

var bcrypt = require("bcrypt");

var fs = require("fs");

var _require2 = require("q"),
    async = _require2.async;

var _require3 = require("console"),
    profile = _require3.profile;

var User = db.User;
var userProfileController = {
  getUserProfileById: function getUserProfileById(req, res) {
    var findUserById;
    return regeneratorRuntime.async(function getUserProfileById$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return regeneratorRuntime.awrap(User.findByPk(req.user.id));

          case 3:
            findUserById = _context.sent;
            return _context.abrupt("return", res.status(200).json({
              message: "Get user by id",
              data: findUserById
            }));

          case 7:
            _context.prev = 7;
            _context.t0 = _context["catch"](0);
            console.log(_context.t0);
            return _context.abrupt("return", res.status(500).json({
              message: "Server Error"
            }));

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[0, 7]]);
  },
  editUserProfile: function editUserProfile(req, res) {
    var _req$body, username, phone_number, findUserById;

    return regeneratorRuntime.async(function editUserProfile$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _req$body = req.body, username = _req$body.username, phone_number = _req$body.phone_number;
            _context2.next = 4;
            return regeneratorRuntime.awrap(User.update({
              username: username,
              phone_number: phone_number
            }, {
              where: {
                id: req.user.id
              }
            }));

          case 4:
            _context2.next = 6;
            return regeneratorRuntime.awrap(User.findByPk(req.user.id));

          case 6:
            findUserById = _context2.sent;
            return _context2.abrupt("return", res.status(200).json({
              message: "Data updated",
              data: findUserById
            }));

          case 10:
            _context2.prev = 10;
            _context2.t0 = _context2["catch"](0);
            console.log(_context2.t0);
            return _context2.abrupt("return", res.status(500).json({
              message: "Server Error"
            }));

          case 14:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[0, 10]]);
  },
  editPhotoProfile: function editPhotoProfile(req, res) {
    var path, fileName, profile_picture, _findUserById, findUserById;

    return regeneratorRuntime.async(function editPhotoProfile$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            path = "public/";
            _context3.next = 3;
            return regeneratorRuntime.awrap(User.findOne({
              where: {
                id: req.params.id
              }
            }));

          case 3:
            fileName = _context3.sent;
            _context3.prev = 4;

            if (req.file) {
              req.body.profile_picture = req.file.filename;
            }

            profile_picture = req.body.profile_picture;

            if (!(!fileName.profile_picture === null)) {
              _context3.next = 14;
              break;
            }

            _context3.next = 10;
            return regeneratorRuntime.awrap(User.update({
              profile_picture: profile_picture
            }, {
              where: {
                id: req.user.id
              }
            }));

          case 10:
            _context3.next = 12;
            return regeneratorRuntime.awrap(User.findByPk(req.user.id));

          case 12:
            _findUserById = _context3.sent;
            return _context3.abrupt("return", res.status(200).json({
              message: "Data updated",
              data: _findUserById
            }));

          case 14:
            _context3.next = 16;
            return regeneratorRuntime.awrap(User.update({
              profile_picture: profile_picture
            }, {
              where: {
                id: req.user.id
              }
            }));

          case 16:
            _context3.next = 18;
            return regeneratorRuntime.awrap(User.findByPk(req.user.id));

          case 18:
            findUserById = _context3.sent;
            return _context3.abrupt("return", res.status(200).json({
              message: "Data updated",
              data: findUserById
            }));

          case 22:
            _context3.prev = 22;
            _context3.t0 = _context3["catch"](4);
            console.log(_context3.t0);
            return _context3.abrupt("return", res.status(500).json({
              message: "Server Error"
            }));

          case 26:
          case "end":
            return _context3.stop();
        }
      }
    }, null, null, [[4, 22]]);
  },
  passwordEdit: function passwordEdit(req, res) {
    var password, hashedPassword;
    return regeneratorRuntime.async(function passwordEdit$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            password = req.body.password;
            _context4.next = 4;
            return regeneratorRuntime.awrap(bcrypt.hash(password, 5));

          case 4:
            hashedPassword = _context4.sent;
            _context4.next = 7;
            return regeneratorRuntime.awrap(User.update({
              password: hashedPassword
            }, {
              where: {
                id: req.user.id
              }
            }));

          case 7:
            console.log(password);
            return _context4.abrupt("return", res.status(200).json({
              message: "Password Updated"
            }));

          case 11:
            _context4.prev = 11;
            _context4.t0 = _context4["catch"](0);
            console.log(_context4.t0);
            return _context4.abrupt("return", res.status(500).json({
              message: "Server Error"
            }));

          case 15:
          case "end":
            return _context4.stop();
        }
      }
    }, null, null, [[0, 11]]);
  }
};
module.exports = userProfileController;