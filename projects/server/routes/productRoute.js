const express = require("express")
const router = express.Router()

const { productController } = require("../controllers/productController")

router.get("/", productController.getProduct)
router.post("/", productController.addProduct)
router.get("/detail/:id", productController.getProductDetail)
router.get("/detail/images/:id", productController.getPictures)

module.exports = router