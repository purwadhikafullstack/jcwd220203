const express = require("express")
const router = express.Router()
const shipmentController = require("../controllers/shipmentController")
const { verifyToken } = require("../middlewares/authMiddleware")
const axios = require("axios")

router.get("/userAddress",
 verifyToken, 
 shipmentController.getAddressById)
router.get("/warehouseAddress",
 verifyToken, 
 shipmentController.getWarehouseAddress)
router.post("/query",
 verifyToken, 
 shipmentController.query)

module.exports = router;
