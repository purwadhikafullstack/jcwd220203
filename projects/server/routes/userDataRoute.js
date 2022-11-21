const express = require("express")
const router = express.Router()

const userDataController = require("../controllers/userDataController")
router.get("/getAllUser", userDataController.getAllUser)

module.exports = router
