const express = require("express");
const cors = require("cors");
const { join } = require("path");
const db = require("../models");
const { verifyToken } = require("../middlewares/authMiddleware");
const { sequelize } = require("../models");
const fs = require("fs");
const path = require("path");
dotenv = require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

// Import Routes
const profileRoute = require("../routes/profileRoute");
const authRoute = require("../routes/authRoute");
const adminWarehouseRoute = require("../routes/adminWarehouseRoute.js");
const userDataRoute = require("../routes/userDataRoute");
const adminCategoriesRoute = require("../routes/adminCategoriesRoute");
const addressRoute = require("../routes/addressRoute");
const stockRoute = require("../routes/stockRoute");
const productRoute = require("../routes/productRoute.js");
const adminProductRoute = require("../routes/adminProductRoute.js");
const shipmentRoute = require("../routes/shipmentRoute.js");
const cartsRoute = require("../routes/cartsRoute");
const categoryRoute = require("../routes/categoryRoute");
const addressCheckoutRoute = require("../routes/addressCheckoutRoute");
const userProfileRoute = require("../routes/userProfileRoute");
const transactionsRoute = require("../routes/transactionsRoute");
const exportRoute = require("../routes/exportRoute");
const stockMutationRoute = require("../routes/stockMutationRoute");
const salesReportRoute = require("../routes/salesReportRoute");
const adminOrderRoute = require("../routes/adminOrderRoute");
const adminOrderHistoryRoute = require("../routes/adminOrderHistoryRoute");
const PORT = process.env.PORT || 8000;
const app = express();
app.use(
  cors()
  //     {
  //     origin: [
  //         process.env.WHITELISTED_DOMAIN &&
  //             process.env.WHITELISTED_DOMAIN.split(","),
  //     ],
  // }
);

app.use(express.json());
app.use("/api", express.static(path.join(__dirname, ".././public")));

//#region API ROUTES

// ===========================
// NOTE : Add your routes here

app.use("/api/admin", verifyToken, adminCategoriesRoute);
app.use("/api/userData", userDataRoute);
app.use("/api/product", productRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/carts", verifyToken, cartsRoute);
app.use("/api/transactions", verifyToken, transactionsRoute);
app.use("/api/auth", authRoute);
app.use("/api/shipment", shipmentRoute);

app.use("/api/profile", verifyToken, profileRoute);

app.use("/api/admin/product", verifyToken, adminProductRoute);
app.use("/api/warehouse", verifyToken, adminWarehouseRoute);

app.use("/api/public", express.static("public"));
app.use("/api/address", addressRoute);
app.use("/api/stock", stockRoute);
app.use("/api/checkoutAddress", addressCheckoutRoute);
app.use("/api/user-profile", verifyToken, userProfileRoute);
app.use("/api/export", verifyToken, exportRoute);
app.use("/api/adminOrder", verifyToken, adminOrderRoute);
app.use("/api/stock-mutation", verifyToken, stockMutationRoute);
app.use("/api/admin/order-history", adminOrderHistoryRoute);
app.use("/api/admin/sales-report", salesReportRoute);

app.use("/api/product", productRoute);

app.get("/api", (req, res) => {
  res.send(`Hello, this is my API`);
});

app.get("/api/greetings", (req, res, next) => {
  res.status(200).json({
    message: "Hello, Student !",
  });
});

// ===========================

// not found
app.use((req, res, next) => {
  if (req.path.includes("/api/")) {
    res.status(404).send("Not found !");
  } else {
    next();
  }
});

// error
app.use((err, req, res, next) => {
  if (req.path.includes("/api/")) {
    console.error("Error : ", err.stack);
    res.status(500).send("Error !");
  } else {
    next();
  }
});

//#endregion

//#region CLIENT
const clientPath = "../../client/build";
app.use(express.static(join(__dirname, clientPath)));

// Serve the HTML page
app.get("*", (req, res) => {
  res.sendFile(join(__dirname, clientPath, "index.html"));
});

//#endregion

app.listen(PORT, (err) => {
  if (err) {
    console.log(`ERROR: ${err}`);
  } else {
    db.sequelize.sync({ alter: true });
    if (!fs.existsSync("public")) {
      fs.mkdirSync("public");
    }
    console.log(`APP RUNNING at ${PORT} ✅`);
  }
});
