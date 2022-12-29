require("dotenv/config")
const express = require("express")
const cors = require("cors")
const { join } = require("path")
const db = require("../models")
const { verifyToken } = require("../middlewares/authMiddleware")
const { sequelize } = require("../models")

const fs = require("fs")

// Import Routes
const profileRoute = require("../routes/profileRoute")
const authRoute = require("../routes/authRoute")
const adminWarehouseRoute = require("../routes/adminWarehouseRoute.js")
const userDataRoute = require("../routes/userDataRoute")
const adminCategoriesRoute = require("../routes/adminCategoriesRoute")
const addressRoute = require("../routes/addressRoute")
const stockRoute = require("../routes/stockRoute")
const productRoute = require("../routes/productRoute.js")
const adminProductRoute = require("../routes/adminProductRoute.js")
const shipmentRoute = require("../routes/shipmentRoute.js")
const cartsRoute = require("../routes/cartsRoute")
const categoryRoute = require("../routes/categoryRoute")
const addressCheckoutRoute = require("../routes/addressCheckoutRoute")
const userProfileRoute = require("../routes/userProfileRoute")
const transactionsRoute = require("../routes/transactionsRoute")
const exportRoute = require("../routes/exportRoute")
const stockMutationRoute = require("../routes/stockMutationRoute")
const salesReportRoute = require("../routes/salesReportRoute")
const adminOrderRoute = require("../routes/adminOrderRoute")
const adminOrderHistoryRoute = require("../routes/adminOrderHistoryRoute")
const PORT = process.env.PORT || 8000
const app = express()
app.use(
    cors()
    //     {
    //     origin: [
    //         process.env.WHITELISTED_DOMAIN &&
    //             process.env.WHITELISTED_DOMAIN.split(","),
    //     ],
    // }
)

app.use(express.json())

//#region API ROUTES

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

app.use("/public", express.static("public"))
app.use("/address", addressRoute)
app.use("/stock", stockRoute)
app.use("/checkoutAddress", addressCheckoutRoute)
app.use("/user-profile", verifyToken, userProfileRoute)
app.use("/export", verifyToken, exportRoute)
app.use("/adminOrder", verifyToken, adminOrderRoute)
app.use("/stock-mutation", verifyToken, stockMutationRoute)
app.use("/admin/order-history", adminOrderHistoryRoute)
app.use("/admin/sales-report", salesReportRoute)

app.get("/api", (req, res) => {
    res.send(`Hello, this is my API`)
})

app.get("/api/greetings", (req, res, next) => {
    res.status(200).json({
        message: "Hello, Student !",
    })
})

// ===========================

// not found
app.use((req, res, next) => {
    if (req.path.includes("/api/")) {
        res.status(404).send("Not found !")
    } else {
        next()
    }
})

// error
app.use((err, req, res, next) => {
    if (req.path.includes("/api/")) {
        console.error("Error : ", err.stack)
        res.status(500).send("Error !")
    } else {
        next()
    }
})

//#endregion

//#region CLIENT
const clientPath = "../../client/build"
app.use(express.static(join(__dirname, clientPath)))

// Serve the HTML page
// app.get("*", (req, res) => {
//     res.sendFile(join(__dirname, clientPath, "index.html"))
// })

//#endregion

app.listen(PORT, (err) => {
    if (err) {
        console.log(`ERROR: ${err}`)
    } else {
        db.sequelize.sync({ alter: true })
        if (!fs.existsSync("public")) {
            fs.mkdirSync("public")
        }
        console.log(`APP RUNNING at ${PORT} ✅`)
    }
})
