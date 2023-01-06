const express = require('express')
const cartsController = require('../controllers/cartsController')

const router = express.Router()

router.post("/", cartsController.addToCart)
router.get("/me", cartsController.ShowAllMyCartItems)
router.patch("/addCartItems/:ProductId", cartsController.addToExistingCart)
router.get("/cartBy/ProductId/:ProductId", cartsController.findCartByProductId)
router.patch("/increment/:id", cartsController.incrementCartItems)
router.patch("/decrement/:id", cartsController.decrementCartItems)
router.delete("/:id", cartsController.deleteProductFromCart)
router.patch("/cartChecked/:id", cartsController.checkCartItems)
router.patch("/checkAllCarts", cartsController.checkAllCartItems)
router.get("/price/total", cartsController.getTotalPrice)
router.delete("/delete/AllCarts", cartsController.deleteAllCartItems)
router.patch("/updateCartNote/:id", cartsController.addCartNote)
router.get("/cartBy/ProductId/:ProductId", cartsController.findCartByProductId)

module.exports = router