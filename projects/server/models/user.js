"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            User.hasMany(models.Address)
            User.hasMany(models.Warehouse)
            User.belongsTo(models.Role)
        }
    }
    User.init(
        {
            username: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            phone_number: DataTypes.BIGINT,
            profile_picture: DataTypes.STRING,
            is_verify: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
        },
        {
            sequelize,
            modelName: "User",
        }
    )
    return User
}
