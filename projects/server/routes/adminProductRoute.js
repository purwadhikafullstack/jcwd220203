const express = require("express")
const router = express.Router()
const { upload } = require("../lib/uploader")


const { adminProductController } = require("../controllers/adminProductController")

router.get("/", adminProductController.getProduct)
router.get("/category", adminProductController.getCategory)

router.post("/", upload({
    acceptedFileTypes: ["jpg", "jpeg", "png"],
    filePrefix: "product",
  }).single("image_url"), adminProductController.addProduct)
router.post("/detail/:id", upload({
    acceptedFileTypes: ["jpg", "jpeg", "png"],
    filePrefix: "product",
  }).single("image_url"), adminProductController.addImages)

router.get("/detail/:id", adminProductController.getProductDetail)
router.patch("/detail/:id", adminProductController.patchProductDetail)
router.delete("/detail/:id", adminProductController.deleteProductDetail)
router.get("/detail/images/:id", adminProductController.getPictures)
router.delete("/detail/images/:id", adminProductController.deletePictures)

module.exports = router