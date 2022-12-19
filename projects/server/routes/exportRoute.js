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
router.get("/stock/csv", (req, res) => {
    connection.query("SELECT SJ.*, TJ.name, TJ.type, P.product_name FROM journals AS SJ LEFT JOIN Type_journals AS TJ ON SJ.TypeJournalId = TJ.id JOIN Products AS P ON SJ.ProductId = P.id", function (err, data) {
      if (err) throw err;
  
      //JSON
      const jsonData = JSON.parse(JSON.stringify(data));
    //   console.log("jsonData", jsonData);
  
      //csv
      fastcsv
        .write(jsonData, { headers: true })
        .on("finish", function () {
          console.log("Write to product_stock.csv successfully in server folder!");
        })
        .pipe(ws);

        res.send("All process is done!")
    });
  });

// End of exporting stuff

module.exports = router