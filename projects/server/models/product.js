"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.hasMany(models.Image_Url)
      Product.hasMany(models.Total_Stock)
      Product.belongsTo(models.Category)
    }
  }
  Product.init(
    {
      product_name: DataTypes.STRING,
      description: {
        type: DataTypes.TEXT("long"),
        allowNull: true,
      },
      price: DataTypes.INTEGER,
      product_weight: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: "Product",
    }
  )
  return Product
}
