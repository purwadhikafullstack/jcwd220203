require("dotenv/config")
const express = require("express")
const router = express.Router()
const addressController = require("../controllers/addressController")
const { verifyToken } = require("../middlewares/authMiddleware")
const axios = require("axios")
const { validateAddress } = require("../middlewares/validatorMiddleware")

router.get("/userAddress", verifyToken, addressController.getAddressById)

router.post(
  "/addNewAddress",
  verifyToken,
  validateAddress,
  addressController.addNewAddress
)

router.patch(
  "/updateAddress/:id",
  verifyToken,
  validateAddress,
  addressController.updateAddress
)

router.delete(
  "/deleteAddress/:id",
  verifyToken,
  addressController.deleteAddress
)

router.patch("/setDefault/:id", verifyToken, addressController.setAsDefault)

// Config Defaults Axios dengan Detail Akun Rajaongkir
axios.defaults.baseURL = process.env.BASE_URL_RAJAONGKIR
axios.defaults.headers.common["key"] = process.env.RAJAONGKIR_API_KEY
axios.defaults.headers.post["Content-Type"] = process.env.AXIOS_HEADERS
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
