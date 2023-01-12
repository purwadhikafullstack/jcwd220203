const db = require("../models");
const { Op } = require("sequelize");

const Product = db.Product;

const adminProductController = {
  getProduct: async (req, res) => {
    try {
      const _sortBy = req.query._sortBy
      const _sortDir = req.query._sortDir
      const page = parseInt(req.query._page) || 0;
      const limit = parseInt(req.query._limit) || 5;
      const search = req.query._keywordHandler || "";
      const offset = limit * page;

      const totalRows = await Product.count({
        where: {
          [Op.or]: [
            { product_name: { [Op.like]: "%" + search + "%" } },
            { description: { [Op.like]: "%" + search + "%" } },
          ],
        },
      });

      const totalPage = Math.ceil(totalRows / limit);

      const data = await Product.findAll({
        where: {
          [Op.or]: [
            { product_name: { [Op.like]: "%" + search + "%" } },
            { description: { [Op.like]: "%" + search + "%" } },
          ],
        },
        order: [[_sortBy, _sortDir]],
        include: [{ model: db.Image_Url }, { model: db.Category }],
        offset: offset,
        limit: limit,
      });

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
      const { product_name, description, product_weight, price, CategoryId } = req.body;
      const image_url = `${process.env.REACT_APP_IMAGE_URL}${req.file.filename}`;

      const addProductData = await Product.create({
        product_name,
        description,
        price,
        product_weight,
        CategoryId,
      });
      await db.Image_Url.create({
        image_url,
        ProductId: addProductData.id,
      });

      const warehouseIdData = await db.Warehouse.findAll();
      for (let i = 0; i < warehouseIdData.length; i++) {
        await db.Total_Stock.create({
          stock: 0,
          ProductId: addProductData.id,
          WarehouseId: warehouseIdData[i].id,
        });
      }
      
      return res.status(200).json({
        message: "Successfully added product data",
        data: addProductData,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Error adding product",
      });
    }
  },
  addImages: async (req, res) => {
    try {
      const image_url = `${process.env.REACT_APP_IMAGE_URL}${req.file.filename}`;

      await db.Image_Url.create({
        image_url,
        ProductId: req.params.id,
      });

      return res.status(200).json({
        message: "Successfully added product image",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Error adding product image",
      });
    }
  },
  getProductDetail: async (req, res) => {
    try {
      const dataByID = await Product.findOne({
        where: {
          id: req.params.id,
        },
        include: [{ model: db.Image_Url }, { model: db.Category }],
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

  patchProductDetail: async (req, res) => {
    try {
      const { product_name, description, product_weight, price, CategoryId } = req.body;

      await Product.update(
        {
          product_name,
          description,
          product_weight,
          price,
          CategoryId,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );

      return res.status(200).json({
        message: "Successfully edit product data",
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        message: "Failed to edit product data",
      });
    }
  },
  deleteProductDetail: async (req, res) => {
    try {
      const dataByID = await Product.destroy({
        where: {
          id: req.params.id,
        },
      });

      return res.status(200).json({
        message: "Successfully delete product data",
        data: dataByID,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        message: "Failed to delete product data",
      });
    }
  },

  getPictures: async (req, res) => {
    try {
      const takePicture = await db.ImageURL.findAll({
        where: {
          ProductId: req.params.id,
        },
      });
      return res.status(200).json({
        message: "Successfully getting pictures",
        data: takePicture,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Server error when taking pictures",
      });
    }
  },
  getCategory: async (req, res) => {
    try {
      const categories = await db.Category.findAll({});

      return res.status(200).json({
        message: "Successfully getting categories",
        data: categories,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Server error when taking categories",
      });
    }
  },
  deletePictures: async (req, res) => {
    try {
      const dataByID = await db.Image_Url.destroy({
        where: {
          id: req.params.id,
        },
      });

      return res.status(200).json({
        message: "Successfully delete product data",
        data: dataByID,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Server error when taking categories",
      });
    }
  },
};

module.exports = {
  adminProductController,
};
