"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var _require = require("sequelize"),
    Model = _require.Model;

module.exports = function (sequelize, DataTypes) {
  var _Transaction$init;

  var Transaction =
  /*#__PURE__*/
  function (_Model) {
    _inherits(Transaction, _Model);

    function Transaction() {
      _classCallCheck(this, Transaction);

      return _possibleConstructorReturn(this, _getPrototypeOf(Transaction).apply(this, arguments));
    }

    _createClass(Transaction, null, [{
      key: "associate",

      /**
       * Helper method for defining associations.
       * This method is not a part of Sequelize lifecycle.
       * The `models/index` file will call this method automatically.
       */
      value: function associate(models) {
        // define association here
        Transaction.belongsTo(models.User);
        Transaction.belongsTo(models.Order_status);
        Transaction.belongsTo(models.Payment_status);
        Transaction.hasMany(models.TransactionItem);
        Transaction.belongsTo(models.Warehouse);
        Transaction.belongsTo(models.Address);
      }
    }]);

    return Transaction;
  }(Model);

  Transaction.init((_Transaction$init = {
    transaction_name: {
      type: DataTypes.STRING
    },
    total_quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    payment_date: {
      type: DataTypes.DATE
    }
  }, _defineProperty(_Transaction$init, "total_quantity", {
    type: DataTypes.INTEGER
  }), _defineProperty(_Transaction$init, "payment_method", {
    type: DataTypes.STRING
  }), _defineProperty(_Transaction$init, "payment_proof", {
    type: DataTypes.STRING
  }), _defineProperty(_Transaction$init, "total_price", {
    type: DataTypes.INTEGER
  }), _defineProperty(_Transaction$init, "shipping_fee", {
    type: DataTypes.INTEGER
  }), _defineProperty(_Transaction$init, "payment_expired_date", {
    type: DataTypes.DATE
  }), _defineProperty(_Transaction$init, "courir_duration", {
    type: DataTypes.STRING
  }), _defineProperty(_Transaction$init, "is_paid", {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }), _Transaction$init), {
    sequelize: sequelize,
    modelName: "Transaction"
  });
  return Transaction;
};