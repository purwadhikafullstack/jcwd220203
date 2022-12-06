const express = require("express")
const router = express.Router()
const stockController = require("../controllers/stockController")
const { verifyToken } = require("../middlewares/authMiddleware")

router.get("/getAllWarehouse", verifyToken, stockController.getAllWarehouse)
router.get(
  "/getAllProduct/:id",
  verifyToken,
  stockController.getAllStockProductByWarehouse
)
router.patch("/updateStock/:id", verifyToken, stockController.editProductStock)
router.patch("/deleteStock/:id", verifyToken, stockController.deleteStock)
router.get("/getAllCategory/", verifyToken, stockController.getAllCategory)

module.exports = router
