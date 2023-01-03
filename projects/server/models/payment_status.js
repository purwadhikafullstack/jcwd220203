"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Payment_status extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Payment_status.hasMany(models.Transaction)
    }
  }
  Payment_status.init(
    {
      payment_status_name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Payment_status",
    }
  )
  return Payment_status
}
