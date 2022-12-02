const express = require("express")
const router = express.Router()
const { upload } = require("../lib/uploader")
const { verifyToken } = require("../middlewares/authMiddleware")

const userDataController = require("../controllers/userDataController")
router.get("/getAllUser", verifyToken, userDataController.getAllUser)
router.get(
  "/getAllWarehouseAdmin",
  verifyToken,
  userDataController.getAllWarehouseAdmin
)
router.post(
  "/addNewAdmin",
  verifyToken,
  upload({
    acceptedFileTypes: ["jpg", "jpeg", "png"],
    filePrefix: "prove",
  }).single("profile_picture"),
  userDataController.addNewAdmin
)
router.patch(
  "/editAdmin/:id",
  verifyToken,
  upload({
    acceptedFileTypes: ["jpg", "jpeg", "png"],
    filePrefix: "prove",
  }).single("profile_picture"),
  userDataController.updateAdmin
)
router.delete("/deleteAdmin/:id", verifyToken, userDataController.deleteAdmin)
router.get(
  "/findAllWarehouse",
  verifyToken,
  userDataController.findAllWarehouse
)

module.exports = router
