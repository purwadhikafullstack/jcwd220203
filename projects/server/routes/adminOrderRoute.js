const { application } = require("express")
const express = require("express")
const router = express.Router()

const adminOrderController = require("../controllers/adminOrderController")

router.get("/waitingConfirmation", adminOrderController.waitingConfirmation)
router.get("/findOrderStatus", adminOrderController.findOrderStatus)
router.get("/findPaymentStatus", adminOrderController.findPaymentStatus)
router.get("/findWarehouse", adminOrderController.findWarehouse)
router.patch("/approvePayment/:id", adminOrderController.approvePayment)
router.patch("/rejectPayment/:id", adminOrderController.rejectPayment)
router.patch("/sendOrder/:id", adminOrderController.sendOrder)
router.patch("/cancelOrder/:id", adminOrderController.cancelOrder)
router.patch("/deliverOrder/:id", adminOrderController.deliverOrder)
module.exports = router
