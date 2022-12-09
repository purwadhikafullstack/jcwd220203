const express = require('express')
const cartsController = require('../controllers/cartsController')
const { verifyToken } = require('../middlewares/authMiddleware')

const router = express.Router()

router.post("/", verifyToken, cartsController.addToCart)
router.get("/me", verifyToken, cartsController.ShowAllMyCartItems)
router.get("/:id", cartsController.getCartItemById)
router.patch("/addCartItems/:ProductId", cartsController.addToCart2)
router.get("/cartBy/ProductId/:ProductId", cartsController.findCartByProductId)
router.post("/increment/:id", cartsController.incrementCartItems)
router.patch("/decrement/:id", cartsController.decrementCartItems)
router.delete("/:id", cartsController.deleteProductFromCart)
router.patch("/cartChecked/:id", cartsController.checkCartItems)
router.patch("/checkAllCarts", verifyToken, cartsController.checkAllCartItems)
router.get("/price/total", verifyToken, cartsController.getTotalPrice)
router.delete("/delete/AllCarts", verifyToken, cartsController.deleteAllCartItems)
router.patch("/updateCartNote/:id", cartsController.addCartNote)
router.get("/cartBy/ProductId/:ProductId", cartsController.findCartByProductId)

module.exports = router