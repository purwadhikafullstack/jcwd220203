"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction.belongsTo(models.User)
      Transaction.belongsTo(models.Order_status)
      Transaction.belongsTo(models.Payment_status)
      Transaction.hasMany(models.TransactionItem)
      Transaction.belongsTo(models.Address)
    }
  }
  Transaction.init(
    {
      transaction_name: {
        type: DataTypes.STRING
      },
      total_quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      payment_date: {
        type: DataTypes.DATE,
      },
      total_quantity: {
        type: DataTypes.INTEGER,
      },
      payment_method: {
        type: DataTypes.STRING,
      },
      payment_proof: {
        type: DataTypes.STRING,
      },
      total_price: {
        type: DataTypes.INTEGER,
      },
      shipping_fee: {
        type: DataTypes.INTEGER
      },
      payment_expired_date: {
        type: DataTypes.DATE
      },
      courir_duration: {
        type: DataTypes.STRING
      },
      is_paid: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {
      sequelize,
      modelName: "Transaction",
    }
  )
  return Transaction
}