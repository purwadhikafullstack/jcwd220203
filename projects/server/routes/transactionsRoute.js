const express = require("express")
const transactionsController = require("../controllers/transactionsController")
const { upload } = require("../lib/uploader")

const router = express.Router()

router.get("/checkoutCartItems", transactionsController.checkoutCartItems)
router.post("/payItems", transactionsController.createNewTransaction)
router.get("/name", transactionsController.getTransactionByTransactionName)
router.post(
    "/payment-proof/:transaction_name",
    upload({
        acceptedFileTypes: ["png", "jpeg", "jpg"],
        filePrefix: "PROOF",
    }).single("payment_proof"),
    transactionsController.paymentProofUpload
)
router.patch(
    "/payment-expired/:transaction_name",
    transactionsController.setPaymentExpired
)
router.get("/all-transaction-list", transactionsController.getAllMyTransaction)
router.get("/transaction-list", transactionsController.getMyTransactionList)
router.get("/unpaid-transaction", transactionsController.getUnpaidTransaction)
router.patch(
    "/finish-order/:transaction_name",
    transactionsController.finishTransactionHandler
)

router.patch(
    "/cancel-unpaid-transaction/:transaction_name",
    transactionsController.cancelUnpaidTransactionHandler
)
router.patch(
    "/cancel-paid-transaction/:transaction_name",
    transactionsController.cancelPaidTransactionHandler
)
module.exports = router
