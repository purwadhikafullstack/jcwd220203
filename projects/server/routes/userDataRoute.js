const express = require("express")
const router = express.Router()
const { upload } = require("../lib/uploader")
const { verifyToken } = require("../middlewares/authMiddleware")
const userDataController = require("../controllers/userDataController")
const {
  validateAdmin,
  validateAdminUpdate,
} = require("../middlewares/validatorMiddleware")
router.get("/getAllUser", verifyToken, userDataController.getAllUser)

router.get(
  "/getAllWarehouseAdmin",
  verifyToken,
  userDataController.getAllWarehouseAdmin
)

router.post(
  "/addNewAdmin",
  verifyToken,
  validateAdmin,
  upload({
    acceptedFileTypes: ["jpg", "jpeg", "png"],
    filePrefix: "PROFILE_PICTURE",
  }).single("profile_picture"),
  userDataController.addNewAdmin
)

router.patch(
  "/editAdmin/:id",
  verifyToken,
  validateAdminUpdate,
  upload({
    acceptedFileTypes: ["jpg", "jpeg", "png"],
    filePrefix: "PROFILE_PICTURE",
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
