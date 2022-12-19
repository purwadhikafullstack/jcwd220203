"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Address.belongsTo(models.User)
      Address.hasMany(models.Transaction)
    }
  }
  Address.init(
    {
      recipients_name: DataTypes.STRING,
      latitude: DataTypes.STRING,
      longitude: DataTypes.STRING,
      phone_number: DataTypes.STRING,
      address_labels: DataTypes.STRING,
      provinceId: DataTypes.INTEGER,
      province: DataTypes.STRING,
      cityId: DataTypes.INTEGER,
      city: DataTypes.STRING,
      districts: DataTypes.STRING,
      full_address: DataTypes.STRING,
      is_default: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Address",
    }
  )
  return Address
}
