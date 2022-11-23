const adminController = require("../controllers/adminController")
const express = require("express")

const router = express.Router()

router.post("/login", adminController.adminLogin)

module.exports = router
