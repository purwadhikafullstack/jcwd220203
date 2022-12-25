"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
    class Total_Stock extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Total_Stock.belongsTo(models.Product)
            Total_Stock.belongsTo(models.Warehouse)
        }
    }
    Total_Stock.init(
        {
            stock: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "Total_Stock",
        }
    )
    return Total_Stock
}
