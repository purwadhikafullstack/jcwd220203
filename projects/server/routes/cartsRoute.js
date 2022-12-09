const express = require('express')
const cartsController = require('../controllers/cartsController')
const { verifyToken } = require('../middlewares/authMiddleware')

const router = express.Router()

router.post("/", verifyToken, cartsController.addToCart)
router.get("/me", verifyToken, cartsController.ShowAllMyCartItems)
router.get("/:id", cartsController.getCartItemById)
router.patch("/addCartItems/:ProductId", cartsController.addToCart2)
router.get("/cartBy/ProductId/:ProductId", cartsController.findCartByProductId)

module.exports = router