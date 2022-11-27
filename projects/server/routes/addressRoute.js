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

// Config Defaults Axios dengan Detail Akun Rajaongkir
axios.defaults.baseURL = "https://emsifa.github.io/api-wilayah-indonesia/api"
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded"

//   Provinsi
router.get("/province", (req, res) => {
  axios
    .get("/provinces.json")
    .then((response) => res.json(response.data))
    .catch((err) => res.send(err))
})

// Kota / Kabupaten
router.get("/city/:provinceId", (req, res) => {
  const id = req.params.provinceId
  axios
    .get(`/regencies/${id}.json`)
    .then((response) => res.json(response.data))
    .catch((err) => res.send(err))
})

// Kecamatan
router.get("/districts/:cityId", (req, res) => {
  const id = req.params.cityId
  axios
    .get(`/districts/${id}.json`)
    .then((response) => res.json(response.data))
    .catch((err) => res.send(err))
})

// Kelurahan
router.get("/ward/:districtsId", (req, res) => {
  const id = req.params.districtsId
  axios
    .get(`/villages/${id}.json`)
    .then((response) => res.json(response.data))
    .catch((err) => res.send(err))
})

module.exports = router
