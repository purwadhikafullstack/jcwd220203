const express = require("express")
const router = express.Router()

const stockMutationController = require("../controllers/stockMutationController")

router.get("/getAllStockMutation", stockMutationController.getMutStock)
router.get("/warehouse", stockMutationController.warehouseData)
router.get("/product", stockMutationController.productData)
router.post("/addMutation", stockMutationController.addNewMutData)
router.post("/approveMutation/:id", stockMutationController.approveMut)
router.post("/denyMutation/:id", stockMutationController.denyMut)

module.exports = router
