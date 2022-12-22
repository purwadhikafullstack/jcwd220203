"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Mutation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Mutation.belongsTo(models.Product)
      Mutation.belongsTo(models.Transaction)
      Mutation.belongsTo(models.User)
    }
  }
  Mutation.init(
    {
      from_warehouse: {
        type: DataTypes.STRING,
      },
      to_warehouse: {
        type: DataTypes.STRING,
      },
      quantity: {
        type: DataTypes.INTEGER,
      },
      mutation_status: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "Mutation",
    }
  )
  return Mutation
}
