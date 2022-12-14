"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
    class TransactionItem extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            // TransactionItem.belongsTo(models.Transaction)
            TransactionItem.belongsTo(models.Product)
            TransactionItem.belongsTo(models.Cart)
        }
    }
    TransactionItem.init(
        {
            quantity: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
            note: DataTypes.STRING,
            price_per_item: DataTypes.INTEGER
        },

        {
            sequelize,
            modelName: "TransactionItem",
        }
    )
    return TransactionItem
}
