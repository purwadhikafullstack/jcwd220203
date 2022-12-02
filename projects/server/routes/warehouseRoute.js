const express = require("express")
const router = express.Router()


const warehouseController = require("../controllers/warehouseController")
router.get("/", warehouseController.getAllWarehouseData)
// router.post("/", warehouseController.addWarehouseData)
router.post("/", warehouseController.addNewWarehouse)
router.patch("/:id", warehouseController.editWarehouseData)
router.delete("/:id", warehouseController.deleteWarehouseData)

module.exports = router;
