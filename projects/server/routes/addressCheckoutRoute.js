const express = require("express")
const router = express.Router()
const addressCheckoutController = require("../controllers/addressCheckoutController")
const { verifyToken } = require("../middlewares/authMiddleware")

router.get(
  "/defaultAddress",
  verifyToken,
  addressCheckoutController.getMainAddress
)
router.get("/allAddress", verifyToken, addressCheckoutController.getAllAddress)
router.post(
  "/addNewAddress",
  verifyToken,
  addressCheckoutController.addNewAddress
)

module.exports = router
