const productController = require("../controllers/productController")
const express = require("express")

const router = express.Router()

router.get("/", productController.getAllProduct)
router.get("/category", productController.getCategory)

router.get("/:id", productController.getProductById)
router.get("/image/:id", productController.getImage)
router.get("/category/:id", productController.getCategoryId)

module.exports = router