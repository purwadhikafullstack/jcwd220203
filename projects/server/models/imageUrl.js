"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
    class ImageURL extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            ImageURL.belongsTo(models.Product)
        }
    }
    ImageURL.init(
        {
            img_url: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "ImageURL",
        }
    )
    return ImageURL
}
