const adminOrderHistoryController = require("../controllers/adminOrderHistoryController")
const express = require("express")

const router = express.Router()

router.get("/get", adminOrderHistoryController.getOrder)
router.get("/get2", adminOrderHistoryController.getByWarehouseId)
module.exports = router
