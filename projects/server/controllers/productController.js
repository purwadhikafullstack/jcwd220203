const db = require("../models");
const { Op } = require("sequelize");

const Product = db.Product;

const productController = {
  getProduct: async (req, res) => {
    try {
      const page = parseInt(req.query._page) || 0
      const limit = parseInt(req.query._limit) || 5
      const search = req.query._keywordHandler || ""
      const offset = limit * page
      
      const totalRows = await Product.count({
        where: {
          [Op.or]: [
            { nama: { [Op.like]: "%" + search + "%" } },
            { deskripsi: { [Op.like]: "%" + search + "%" } },
          ],
        },
      });
      
      const totalPage = Math.ceil(totalRows / limit);

      const data = await Product.findAll({
        where: {
          [Op.or]: [
            { nama: { [Op.like]: "%" + search + "%" } },
            { deskripsi: { [Op.like]: "%" + search + "%" } },
          ],
        },
        offset: offset,
        limit: limit,
      });;

      return res.status(200).json({
        message: "Successfully getting product data",
        data: data,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        message: "Failed to get product data",
      });
    }
  },
  
  addProduct: async (req, res) => {
    try {
      const { nama, deskripsi, harga } = req.body

      const addProductData = await Product.create({
        nama,
        deskripsi,
        harga,
      })
      return res.status(200).json({
        message: "Successfully added product data",
        data: addProductData
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "Error adding product"
      })
    }
  },
  getProductDetail: async (req, res) => {
    try {
      const dataByID = await Product.findOne({
        where: {
          id: req.params.id
        },
        include: [{model: db.Image_Url}]
      });

      return res.status(200).json({
        message: "Successfully getting product data",
        data: dataByID,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        message: "Failed to get product data",
      });
    }
  },
  
  getPictures: async (req, res) => {
    try {
      const takePicture = await db.ImageURL.findAll({
        where: {
          ProductId: req.params.id
        }
      })
      return res.status(200).json({
        message: "Successfully getting pictures",
        data: takePicture,
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "Server error when taking pictures"
      })
    }
  }
};

module.exports = {
  productController,
};
