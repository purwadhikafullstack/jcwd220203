"use strict";

var adminOrderHistoryController = require("../controllers/adminOrderHistoryController");

var express = require("express");

var router = express.Router();
router.get("/getOrder", adminOrderHistoryController.getAllOrderHistory);
router.get("/findWarehouse", adminOrderHistoryController.findWarehouse);
module.exports = router;