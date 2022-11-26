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
      Warehouse.hasMany(models.User)
    }
    Warehouse.init(
        {
            nama_warehouse: DataTypes.STRING,
            address: DataTypes.STRING,
            state: DataTypes.STRING,
            latitude: DataTypes.STRING,
            longitude: DataTypes.STRING
        },
        {
            sequelize,
            modelName: "Warehouse",
        }
    )
    return Warehouse
}
