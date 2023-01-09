"use strict"

require("dotenv/config")

var express = require("express")

var cors = require("cors")

var _require = require("path"),
    join = _require.join

var db = require("../models")

var _require2 = require("../middlewares/authMiddleware"),
    verifyToken = _require2.verifyToken

var _require3 = require("../models"),
    sequelize = _require3.sequelize

var fs = require("fs") // Import Routes

var profileRoute = require("../routes/profileRoute")

var authRoute = require("../routes/authRoute")

var adminWarehouseRoute = require("../routes/adminWarehouseRoute.js")

var userDataRoute = require("../routes/userDataRoute")

var adminCategoriesRoute = require("../routes/adminCategoriesRoute")

var addressRoute = require("../routes/addressRoute")

var stockRoute = require("../routes/stockRoute")

var productRoute = require("../routes/productRoute.js")

var adminProductRoute = require("../routes/adminProductRoute.js")

var shipmentRoute = require("../routes/shipmentRoute.js")

var cartsRoute = require("../routes/cartsRoute")

var categoryRoute = require("../routes/categoryRoute")

var addressCheckoutRoute = require("../routes/addressCheckoutRoute")

var userProfileRoute = require("../routes/userProfileRoute")

var transactionsRoute = require("../routes/transactionsRoute")

var exportRoute = require("../routes/exportRoute")

var stockMutationRoute = require("../routes/stockMutationRoute")

var salesReportRoute = require("../routes/salesReportRoute")

var adminOrderRoute = require("../routes/adminOrderRoute")

var adminOrderHistoryRoute = require("../routes/adminOrderHistoryRoute")

var PORT = process.env.PORT || 8000
var app = express()
app.use(
    cors() //     {
    //     origin: [
    //         process.env.WHITELISTED_DOMAIN &&
    //             process.env.WHITELISTED_DOMAIN.split(","),
    //     ],
    // }
)
app.use(express.json()) //#region API ROUTES
// ===========================
// NOTE : Add your routes here

app.use("/admin", verifyToken, adminCategoriesRoute)
app.use("/userData", userDataRoute)
app.use("/product", productRoute)
app.use("/categories", categoryRoute)
app.use("/carts", cartsRoute)
app.use("/transactions", verifyToken, transactionsRoute)
app.use("/auth", authRoute)
app.use("/shipment", shipmentRoute)
app.use("/profile", verifyToken, profileRoute)
app.use("/admin/product", verifyToken, adminProductRoute)
app.use("/warehouse", verifyToken, adminWarehouseRoute)
app.use("/public", express["static"]("public"))
app.use("/address", addressRoute)
app.use("/stock", stockRoute)
app.use("/checkoutAddress", addressCheckoutRoute)
app.use("/user-profile", verifyToken, userProfileRoute)
app.use("/export", verifyToken, exportRoute)
app.use("/adminOrder", verifyToken, adminOrderRoute)
app.use("/stock-mutation", verifyToken, stockMutationRoute)
app.use("/admin/order-history", adminOrderHistoryRoute)
app.use("/admin/sales-report", salesReportRoute)
app.get("/api", function (req, res) {
    res.send("Hello, this is my API")
})
app.get("/api/greetings", function (req, res, next) {
    res.status(200).json({
        message: "Hello, Student !",
    })
}) // ===========================
// not found

app.use(function (req, res, next) {
    if (req.path.includes("/api/")) {
        res.status(404).send("Not found !")
    } else {
        next()
    }
}) // error

app.use(function (err, req, res, next) {
    if (req.path.includes("/api/")) {
        console.error("Error : ", err.stack)
        res.status(500).send("Error !")
    } else {
        next()
    }
}) //#endregion
//#region CLIENT

var clientPath = "../../client/build"
app.use(express["static"](join(__dirname, clientPath))) // Serve the HTML page
// app.get("*", (req, res) => {
//     res.sendFile(join(__dirname, clientPath, "index.html"))
// })
//#endregion

app.listen(PORT, function (err) {
    if (err) {
        console.log("ERROR: ".concat(err))
    } else {
        db.sequelize.sync({
            alter: true,
        })

        if (!fs.existsSync("public")) {
            fs.mkdirSync("public")
        }

        console.log("APP RUNNING at ".concat(PORT, " \u2705"))
    }
})
