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
axios.defaults.headers.common["key"] = "b846db1d8b8034b8c1d64c373ac4f5c7"
// key 1 = "990776ee2dd38474bccd1c87261ad965"
// key 2 = "b846db1d8b8034b8c1d64c373ac4f5c7"
// key 3 = "8caa8e1b87eb967bf57f446ae05b1f61"
// key 4 = "219e2276d40a703824dea05e2ebfb639"

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
