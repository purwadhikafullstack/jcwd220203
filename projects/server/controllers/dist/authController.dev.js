"use strict";

var db = require("../models");

var bcrypt = require("bcrypt");

var _require = require("../lib/jwt"),
    signToken = _require.signToken,
    decode = _require.decode;

var fs = require("fs");

var handlebars = require("handlebars");

var emailer = require("../Lib/emailer");

var User = db.User;
var authController = {
  loginUser: function loginUser(req, res) {
    var _req$body, email, password, findUserByEmail, passwordValid, token;

    return regeneratorRuntime.async(function loginUser$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _req$body = req.body, email = _req$body.email, password = _req$body.password;
            _context.next = 4;
            return regeneratorRuntime.awrap(User.findOne({
              where: {
                email: email
              },
              include: [{
                model: db.Warehouse
              }]
            }));

          case 4:
            findUserByEmail = _context.sent;

            if (findUserByEmail) {
              _context.next = 7;
              break;
            }

            return _context.abrupt("return", res.status(400).json({
              message: "Email not found"
            }));

          case 7:
            if (!(findUserByEmail.is_verify === false)) {
              _context.next = 9;
              break;
            }

            return _context.abrupt("return", res.status(400).json({
              message: "Unverified user"
            }));

          case 9:
            passwordValid = bcrypt.compareSync(password, findUserByEmail.password);

            if (passwordValid) {
              _context.next = 12;
              break;
            }

            return _context.abrupt("return", res.status(400).json({
              message: "Password invalid"
            }));

          case 12:
            delete findUserByEmail.dataValues.password;
            token = signToken({
              id: findUserByEmail.id
            });
            return _context.abrupt("return", res.status(201).json({
              message: "User logged in",
              data: findUserByEmail,
              token: token
            }));

          case 17:
            _context.prev = 17;
            _context.t0 = _context["catch"](0);
            console.log(_context.t0);
            return _context.abrupt("return", res.status(500).json({
              message: "Server error"
            }));

          case 21:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[0, 17]]);
  },
  refreshToken: function refreshToken(req, res) {
    var findUserById, renewedToken;
    return regeneratorRuntime.async(function refreshToken$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return regeneratorRuntime.awrap(User.findByPk(req.user.id));

          case 3:
            findUserById = _context2.sent;
            renewedToken = signToken({
              id: req.user.id
            });
            return _context2.abrupt("return", res.status(200).json({
              message: "Renewed user token",
              data: findUserById,
              token: renewedToken
            }));

          case 8:
            _context2.prev = 8;
            _context2.t0 = _context2["catch"](0);
            console.log(_context2.t0);
            return _context2.abrupt("return", res.status(500).json({
              message: "Server error"
            }));

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[0, 8]]);
  },
  loginWithSocialMedia: function loginWithSocialMedia(req, res) {
    var _req$body2, username, email, findUserByEmail, findRole, newUser, _token, link, rawHTML, compiledHTML, htmlResult, token;

    return regeneratorRuntime.async(function loginWithSocialMedia$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _req$body2 = req.body, username = _req$body2.username, email = _req$body2.email;
            _context3.next = 4;
            return regeneratorRuntime.awrap(User.findOne({
              where: {
                email: email
              }
            }));

          case 4:
            findUserByEmail = _context3.sent;

            if (findUserByEmail) {
              _context3.next = 22;
              break;
            }

            if (!findUserByEmail) {
              _context3.next = 8;
              break;
            }

            return _context3.abrupt("return", res.status(400).json({
              message: "Email already registered"
            }));

          case 8:
            _context3.next = 10;
            return regeneratorRuntime.awrap(db.Role.findOne({
              where: {
                id: 1
              }
            }));

          case 10:
            findRole = _context3.sent;
            _context3.next = 13;
            return regeneratorRuntime.awrap(User.create({
              RoleId: findRole.dataValues.id,
              username: username,
              email: email,
              is_verify: true
            }));

          case 13:
            newUser = _context3.sent;
            _token = signToken({
              id: newUser.id
            });
            link = process.env.BASE_URL_FE;
            rawHTML = fs.readFileSync("templates/welcome.html", "utf-8");
            compiledHTML = handlebars.compile(rawHTML);
            htmlResult = compiledHTML({
              username: username,
              link: link
            });
            _context3.next = 21;
            return regeneratorRuntime.awrap(emailer({
              to: email,
              html: htmlResult,
              subject: "Welcome to Shopedia",
              text: "Welcome to Shopedia"
            }));

          case 21:
            return _context3.abrupt("return", res.status(201).json({
              message: "User registered",
              data: newUser
            }));

          case 22:
            token = signToken({
              id: findUserByEmail.id
            });
            return _context3.abrupt("return", res.status(200).json({
              message: "Login User",
              data: findUserByEmail,
              token: token
            }));

          case 26:
            _context3.prev = 26;
            _context3.t0 = _context3["catch"](0);
            console.log(_context3.t0);
            return _context3.abrupt("return", res.status(500).json({
              message: "Server Error"
            }));

          case 30:
          case "end":
            return _context3.stop();
        }
      }
    }, null, null, [[0, 26]]);
  },
  requestResetPassword: function requestResetPassword(req, res) {
    var email, findUserByEmail, reset_token, resetPasswordLink, rawHTML, compiledHTML, htmlResult;
    return regeneratorRuntime.async(function requestResetPassword$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            email = req.body.email;
            _context4.next = 4;
            return regeneratorRuntime.awrap(User.findOne({
              where: {
                email: email
              }
            }));

          case 4:
            findUserByEmail = _context4.sent;

            if (findUserByEmail) {
              _context4.next = 7;
              break;
            }

            return _context4.abrupt("return", res.status(400).json({
              message: "Email not found"
            }));

          case 7:
            if (!(findUserByEmail.is_verify === false)) {
              _context4.next = 9;
              break;
            }

            return _context4.abrupt("return", res.status(400).json({
              message: "Unverified user"
            }));

          case 9:
            reset_token = signToken({
              id: findUserByEmail.id
            });
            resetPasswordLink = "".concat(process.env.BASE_URL_FE, "reset-password-confirmation?reset_token=").concat(reset_token);
            rawHTML = fs.readFileSync("templates/resetPassword.html", "utf-8");
            compiledHTML = handlebars.compile(rawHTML);
            htmlResult = compiledHTML({
              email: email,
              resetPasswordLink: resetPasswordLink,
              username: findUserByEmail.username
            });
            _context4.next = 16;
            return regeneratorRuntime.awrap(emailer({
              to: email,
              html: htmlResult,
              subject: "reset your password",
              text: "setting new password"
            }));

          case 16:
            return _context4.abrupt("return", res.status(201).json({
              message: "Your reset password confirmation has been sent",
              data: findUserByEmail,
              token: reset_token
            }));

          case 19:
            _context4.prev = 19;
            _context4.t0 = _context4["catch"](0);
            console.log(_context4.t0);
            return _context4.abrupt("return", res.status(500).json({
              message: "Server error"
            }));

          case 23:
          case "end":
            return _context4.stop();
        }
      }
    }, null, null, [[0, 19]]);
  },
  inputNewPassword: function inputNewPassword(req, res) {
    var _req$body3, newPassword, confirmNewPassword, token, decodedToken, findUserByEmail, passwordUsed, hashedPassword;

    return regeneratorRuntime.async(function inputNewPassword$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            _req$body3 = req.body, newPassword = _req$body3.newPassword, confirmNewPassword = _req$body3.confirmNewPassword, token = _req$body3.token;

            if (token) {
              _context5.next = 4;
              break;
            }

            return _context5.abrupt("return", res.status(401).json({
              message: "User unauthorized"
            }));

          case 4:
            decodedToken = decode(token);

            if (decodedToken) {
              _context5.next = 7;
              break;
            }

            return _context5.abrupt("return", res.status(401).json({
              message: "Unauthorized request"
            }));

          case 7:
            _context5.next = 9;
            return regeneratorRuntime.awrap(User.findOne({
              where: {
                id: decodedToken.id
              }
            }));

          case 9:
            findUserByEmail = _context5.sent;

            if (newPassword.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)) {
              _context5.next = 12;
              break;
            }

            return _context5.abrupt("return", res.status(500).json({
              message: "Password Must Contain 8 Characters, 1 Uppercase, 1 Lowercase, 1 Number and 1 Special Case Character"
            }));

          case 12:
            if (!(newPassword !== confirmNewPassword)) {
              _context5.next = 14;
              break;
            }

            return _context5.abrupt("return", res.status(500).json({
              message: "Password doesn't match"
            }));

          case 14:
            passwordUsed = bcrypt.compareSync(newPassword, findUserByEmail.password);

            if (!passwordUsed) {
              _context5.next = 17;
              break;
            }

            return _context5.abrupt("return", res.status(400).json({
              message: "the new password must be different from the old password"
            }));

          case 17:
            hashedPassword = bcrypt.hashSync(newPassword, 5);
            _context5.next = 20;
            return regeneratorRuntime.awrap(User.update({
              password: hashedPassword
            }, {
              where: {
                id: findUserByEmail.id
              }
            }));

          case 20:
            return _context5.abrupt("return", res.status(201).json({
              message: "Password has been reset "
            }));

          case 23:
            _context5.prev = 23;
            _context5.t0 = _context5["catch"](0);
            console.log(_context5.t0);
            return _context5.abrupt("return", res.status(500).json({
              message: "Server error"
            }));

          case 27:
          case "end":
            return _context5.stop();
        }
      }
    }, null, null, [[0, 23]]);
  }
};
module.exports = {
  authController: authController
};