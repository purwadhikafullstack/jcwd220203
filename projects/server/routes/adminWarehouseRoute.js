const express = require("express")
const router = express.Router()


const adminWarehouseController = require("../controllers/adminWarehouseController")
router.get("/", adminWarehouseController.getAllWarehouseData)
// router.post("/", adminWarehouseController.addWarehouseData)
router.post("/", adminWarehouseController.addNewWarehouse)
router.patch("/:id", adminWarehouseController.editWarehouseData)
router.delete("/:id", adminWarehouseController.deleteWarehouseData)

module.exports = router;
