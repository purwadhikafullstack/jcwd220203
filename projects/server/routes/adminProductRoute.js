const express = require("express")
const router = express.Router()

const { adminProductController } = require("../controllers/adminProductController")

router.get("/", adminProductController.getProduct)
router.post("/", adminProductController.addProduct)
router.get("/detail/:id", adminProductController.getProductDetail)
router.get("/detail/images/:id", adminProductController.getPictures)

module.exports = router