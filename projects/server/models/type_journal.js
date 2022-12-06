"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Type_Journal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Type_Journal.hasMany(models.Journal)
    }
  }
  Type_Journal.init(
    {
      name: DataTypes.STRING,
      type: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Type_Journal",
    }
  )
  return Type_Journal
}
