const adminController = require("../controllers/adminController")
const express = require("express")
const { upload } = require("../lib/uploader")
const { verifyToken } = require("../middlewares/authMiddleware")
const router = express.Router()

router.post("/login", adminController.adminLogin)

router.post(
    "/categories",
    verifyToken,
    upload({
        acceptedFileTypes: ["png", "jpeg", "jpg"],
        filePrefix: "CATEGORY",
    }).single("category_image"),
    adminController.adminCreateCategory
)
router.get("/categories", verifyToken, adminController.adminGetAllCategories)
router.patch(
    "/categories/:id",
    verifyToken,
    upload({
        acceptedFileTypes: ["png", "jpeg", "jpg"],
        filePrefix: "CATEGORY",
    }).single("category_image"),
    adminController.adminUpdateCategory)
router.delete("/categories/:id", verifyToken, adminController.adminDeleteCategory)

module.exports = router
