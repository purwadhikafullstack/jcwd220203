const express = require("express")
const router = express.Router()
const salesReportController = require("../controllers/salesReportController")

router.get("/get", salesReportController.getReport)
router.get("/findWarehouse", salesReportController.findWarehouse)

module.exports = router
