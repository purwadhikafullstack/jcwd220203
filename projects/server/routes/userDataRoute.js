const express = require("express")
const router = express.Router()
const { upload } = require("../lib/uploader")

const userDataController = require("../controllers/userDataController")
router.get("/getAllUser", userDataController.getAllUser)
router.get("/getAllWarehouseAdmin", userDataController.getAllWarehouseAdmin)
router.post("/addNewAdmin", userDataController.addNewAdmin)
router.patch(
  "/editAdmin/:id",
  upload({
    acceptedFileTypes: ["jpg", "jpeg", "png"],
    filePrefix: "prove",
  }).single("profile_picture"),
  userDataController.updateAdmin
)
router.delete("/deleteAdmin/:id", userDataController.deleteAdmin)
router.get("/findAllWarehouse", userDataController.findAllWarehouse)

module.exports = router
