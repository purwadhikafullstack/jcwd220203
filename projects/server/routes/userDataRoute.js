const express = require("express")
const router = express.Router()
const { upload } = require("../lib/uploader")
const { verifyToken } = require("../middlewares/authMiddleware")

const userDataController = require("../controllers/userDataController")
const { body } = require("express-validator")
router.get("/getAllUser", verifyToken, userDataController.getAllUser)
router.get(
  "/getAllWarehouseAdmin",
  verifyToken,
  userDataController.getAllWarehouseAdmin
)

router.post(
  "/addNewAdmin",
  verifyToken,

  body("email").isEmail().notEmpty(),

  body("passwrod", "Password not strong enough").isStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minUppercase: 1,
    minSymbols: 1,
    minLowercase: 1,
  }),

  body("phone_number").isLength({ min: 9 }).isNumeric().notEmpty(),

  body(
    "username",
    "Username length has to be min 3, and only contain alphanumeric chars"
  )
    .isLength({ min: 3 })
    .isAlphanumeric()
    .notEmpty(),

  body("WarehouseId").isNumeric().notEmpty(),

  upload({
    acceptedFileTypes: ["jpg", "jpeg", "png"],
    filePrefix: "prove",
  }).single("profile_picture"),
  userDataController.addNewAdmin
)

router.patch(
  "/editAdmin/:id",
  verifyToken,

  body("email").isEmail(),

  body("passwrod", "Password not strong enough").isStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minUppercase: 1,
    minSymbols: 1,
    minLowercase: 1,
  }),

  body("phone_number").isLength({ min: 9 }).isNumeric(),

  body(
    "username",
    "Username length has to be min 3, and only contain alphanumeric chars"
  )
    .isLength({ min: 3 })
    .isAlphanumeric(),
  body("WarehouseId").isNumeric(),

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
