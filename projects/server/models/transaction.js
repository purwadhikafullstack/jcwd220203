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
            Transaction.hasMany(models.TransactionItem)
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
            order_status: {
                type: DataTypes.STRING,
                defaultValue: "Awaiting for payment"
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
            is_paid: {
                defaultValue: false,
                type: DataTypes.STRING

            }
        },
        {
            sequelize,
            modelName: "Transaction",
        }
    )
    return Transaction
}