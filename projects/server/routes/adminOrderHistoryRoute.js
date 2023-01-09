const adminOrderHistoryController = require("../controllers/adminOrderHistoryController")
const express = require("express")

const router = express.Router()

router.get("/getOrder", adminOrderHistoryController.getAllOrderHistory)
router.get("/findWarehouse", adminOrderHistoryController.findWarehouse)
module.exports = router
