"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Warehouse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Warehouse.hasOne(models.User)
    }
  }
  Warehouse.init(
    {
      nama_warehouse: DataTypes.STRING,
      address_labels: DataTypes.STRING,
      province: DataTypes.STRING,
      city: DataTypes.STRING,
      districts: DataTypes.STRING,
      latitude: DataTypes.STRING,
      longitude: DataTypes.STRING,
      full_address: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Warehouse",
    }
  )
  return Warehouse
}
