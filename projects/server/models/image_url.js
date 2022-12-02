"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
    class Image_Url extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Image_Url.belongsTo(models.Product)
        }
    }
    Image_Url.init(
        {
            image_url: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Image_Url",
        }
    )
    return Image_Url
}
