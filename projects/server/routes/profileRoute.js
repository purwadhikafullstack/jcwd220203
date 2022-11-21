const profileController = require("../controllers/profileController")
const express = require("express")
const { upload } = require("../lib/uploader")

const router = express.Router()

router.get("/:id", profileController.getUserProfileById)
router.patch(
    "/:id",
    upload({
        acceptedFileTypes: ["jpg", "jpeg", "png"],
        filePrefix: "prove",
    }).single("profile_picture"),
    profileController.editUserProfile
)

module.exports = router
