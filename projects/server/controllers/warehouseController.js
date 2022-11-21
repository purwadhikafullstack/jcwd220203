const db = require("../models");

const warehouseController = {
  getAllWarehouseData: async (req, res) => {
    try {
      const findWarehouse = await db.Warehouse.findAll();
      // console.log(findWarehouse)
      return res.status(200).json({
        message: "Warehouse data found!",
        data: findWarehouse,
      });
    } catch (err) {
      return res.status(500).json({
        message: "Server error get all warehouse",
      });
    }
  },
  addWarehouseData: async (req, res) => {
    try {
      const { nama_warehouse, address } = req.body;

      await db.Warehouse.create(
        {
          nama_warehouse,
          address,
        },
      );
      return res.status(200).json({
        message: "Created new warehouse",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Server error adding new warehouse",
      });
    }
  },
  editWarehouseData: async (req, res) => {
    try {
      const { nama_warehouse, address } = req.body;

      await db.Warehouse.update(
        {
          nama_warehouse,
          address,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );
      return res.status(200).json({
        message: "Updated this book",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Server error editing warehouse",
      });
    }
  },
  deleteWarehouseData: async (req, res) => {
    try {
      await db.Warehouse.destroy({
        where: {
          id: req.params.id,
        },
      });
      return res.status(200).json({
        message: "Warehouse deleted",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Server error get all warehouse",
      });
    }
  },
};

module.exports = warehouseController;
