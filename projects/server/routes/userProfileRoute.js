const userProfileController = require("../controllers/userProfileController")
const express = require("express")
const { upload } = require("../lib/uploader")
const { check, oneOf } = require("express-validator")
const {
    editUsernameOrPassword,
    editUsernameOrPhone,
    infoSchema,
} = require("../middlewares/profileValidator")

const router = express.Router()

router.get("/get/:id", userProfileController.getUserProfileById)

router.patch("/info/:id", userProfileController.editUserProfile)
router.patch(
    "/pic/:id",
    upload({
        acceptedFileTypes: ["jpg", "jpeg", "png"],
        filePrefix: "PROFILE",
        limits: { fileSize: 210 },
    }).single("profile_picture"),
    userProfileController.editPhotoProfile
)
router.patch("/password/:id", userProfileController.passwordEdit)

module.exports = router
