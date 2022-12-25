const db = require("../models");
const { Op } = require("sequelize");

const stockMutationController = {
  getMutStock: async (req, res) => {
    try {
      const {
        id = "",
        _sortBy = "id",
        _sortDir = "ASC",
        _limit = 6,
        _page = 1,
      } = req.query;

      const findAdminById = await db.User.findByPk(req.user.id);

      if (findAdminById.RoleId !== 3 && findAdminById.RoleId !== 2) {
        return res.status(400).json({
          message: "User unauthorized",
        });
      }
      const getAllMutStock = await db.Mutation.findAndCountAll({
        limit: Number(_limit),
        offset: (_page - 1) * _limit,
        order: [[_sortBy, _sortDir]],
        include: [
          { model: db.Product },
          { model: db.Journal },
          { model: db.Transaction },
          { model: db.User },
        ],
        where: {
          id: {
            [Op.like]: `%${id}%`,
          },
        },
      });

      return res.status(200).json({
        message: "Successfully getting stock mutation data",
        data: getAllMutStock.rows,
        dataCount: getAllMutStock.count,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Server Error getting stock mutation data",
      });
    }
  },
  warehouseData: async (req, res) => {
    try {
      const whData = await db.Warehouse.findAll({});
      return res.status(200).json({
        message: "Successfully getting warehouse data",
        data: whData,
        dataCount: whData.count,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Error getting warehouse data",
      });
    }
  },
  productData: async (req, res) => {
    try {
      const ProductData = await db.Product.findAll({});
      return res.status(200).json({
        message: "Successfully getting product data",
        data: ProductData,
        dataCount: ProductData.count,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Error getting product data",
      });
    }
  },
  addNewMutData: async (req, res) => {
    try {
      const { from_warehouse, to_warehouse, quantity, ProductId } = req.body;

      const response = await db.Mutation.create({
        from_warehouse,
        to_warehouse,
        mutation_status: "Waiting for approval",
        quantity,
        ProductId,
      });
      return res.status(200).json({
        message: "Successfully created product mutation data",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Error getting product data",
      });
    }
  },
  approveMut: async (req, res) => {
    try {
      const { id } = req.params;
      const findWarehouseId = await db.Mutation.findOne({
        where: {
          id: id
        }
      });
      const quantity = findWarehouseId.quantity

      const warehouseId = findWarehouseId.to_warehouse
      const productId = findWarehouseId.ProductId
      const response = await db.Mutation.update(
        {
          mutation_status: "Approve",
        },
        {
          where: { id: id },
        }
      );
      const findBeforeStock = await db.Total_Stock.findOne({
        where: {
          WarehouseId: warehouseId,
          ProductId: productId,
        }
      })
      const additionStock = Number(findBeforeStock.stock) + Number(quantity)
      await db.Total_Stock.update(
        {
          stock: additionStock,
        },
        {
          where: {
            ProductId: productId,
            WarehouseId: warehouseId,
          },
          include: [{ model: db.Product }],
        }
      );

      const findAfterStock = await db.Total_Stock.findOne({
        where: {
          WarehouseId: warehouseId,
          ProductId: productId,
        }
      })

      const stock_before = findBeforeStock.stock
      const stock_after = findAfterStock.stock

      const addOrMinus = (stock_before, stock_after) => {
        const count = Math.max(stock_before, stock_after);
        if (count === stock_before) {
          return false;
        } else {
          return true;
        }
      };

      const journal = await db.Type_Journal.create({
        name: "Update Stock",
        type: addOrMinus(stock_before, stock_after),
        ProductId: productId,
      })

      const findTypeId = await db.Type_Journal.findByPk(journal.id)

      const takeJournalId = await db.Journal.create({
        stock_before: findBeforeStock.stock,
        stock_after: findAfterStock.stock,
        ProductId: productId,
        TypeJournalId: findTypeId.id,
      })

      await db.Mutation.update(
        {
          JournalId: takeJournalId.id,
          UserId: req.user.id
        },
        {
          where: {
            id: req.params.id,
            ProductId: productId,
            to_warehouse: warehouseId,
          },
        }
      );
      
      return res.status(200).json({
        message: "Successfully created product mutation data",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Error getting product data",
      });
    }
  },
  denyMut: async (req, res) => {
    try {
      const { id } = req.params;
      const response = await db.Mutation.update(
        {
          mutation_status: "Reject",
          UserId: req.user.id,
        },
        {
          where: { id: id },
        }
      );

      return res.status(200).json({
        message: "Successfully deny product mutation data",
      });
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "Error denying data",
      })
    }
  }
};

module.exports = stockMutationController;
