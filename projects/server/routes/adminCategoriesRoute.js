const adminCategoriesController = require("../controllers/adminCategoriesController")
const express = require("express")
const { upload } = require("../lib/uploader")
const { verifyToken } = require("../middlewares/authMiddleware")
const router = express.Router()

router.post(
    "/categories",

    upload({
        acceptedFileTypes: ["png", "jpeg", "jpg"],
        filePrefix: "CATEGORY",
    }).single("category_image"),
    adminCategoriesController.adminCreateCategory
)
router.get("/categories", adminCategoriesController.adminGetAllCategories)
router.patch(
    "/categories/:id",
    upload({
        acceptedFileTypes: ["png", "jpeg", "jpg"],
        filePrefix: "CATEGORY",
    }).single("category_image"),
    adminCategoriesController.adminUpdateCategory)
router.delete("/categories/:id", adminCategoriesController.adminDeleteCategory)

module.exports = router
