const express = require("express")
const router = express.Router()
const addressController = require("../controllers/addressController")
const { verifyToken } = require("../middlewares/authMiddleware")
const axios = require("axios")

router.get("/userAddress", verifyToken, addressController.getAddressById)
router.post("/addNewAddress", verifyToken, addressController.addNewAddress)
router.patch("/updateAddress/:id", verifyToken, addressController.updateAddress)
router.delete(
  "/deleteAddress/:id",
  verifyToken,
  addressController.deleteAddress
)
router.patch("/setDefault/:id", verifyToken, addressController.setAsDefault)

// Config Defaults Axios dengan Detail Akun Rajaongkir
axios.defaults.baseURL = "https://api.rajaongkir.com/starter"
axios.defaults.headers.common["key"] = "e216ad3d4659076abbc64528fa8a712d"
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded"

//   Provinsi
router.get("/province", (req, res) => {
  axios
    .get("/province")
    .then((response) => res.json(response.data))
    .catch((err) => res.send(err))
})

// Kota / Kabupaten
router.get("/city/:provinceId", (req, res) => {
  const id = req.params.provinceId
  axios
    .get(`/city?province=${id}`)
    .then((response) => res.json(response.data))
    .catch((err) => res.send(err))
})

module.exports = router