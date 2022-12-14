const express = require("express")
const transactionsController = require("../controllers/transactionsController")


const router = express.Router()

router.get("/checkoutCartItems", transactionsController.checkoutCartItems)
router.post("/payItems", transactionsController.createNewTransaction)

module.exports = router 