const express = require("express")
const exportController = require("../controllers/exportController")
const router = express.Router()
const fastcsv = require("fast-csv");
const mysql = require("mysql");

const fs = require("fs")
const ws = fs.createWriteStream("product_stock.csv");


router.get("/stock", exportController.showAllStockData)
// router.get("/export_detail", exportController.getexportByName)


// Exporting Stuff
// Create a connection to the database

const connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "password",
    database: "shopedia",
  });


// Getter API
router.get("/stock/csv", exportController.exportcsv);

// End of exporting stuff

module.exports = router