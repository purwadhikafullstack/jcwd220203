const axios = require("axios")
const { Op } = require("sequelize")
const db = require("../models")

const Address = db.Address
const Warehouse = db.Warehouse

const shipmentController = {
  getAddressById: async (req, res) => {
    try {
      const response = await Address.findOne({
        where: {
          UserId: req.user.id,
          is_default: 1,
        },
      })

      return res.status(200).json({
        message: "Successfully Getting User Address",
        data: response,
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "Server Error",
      })
    }
  },
  getWarehouseAddress: async (req, res) => {
    try {
      const response = await Warehouse.findAll()

      return res.status(200).json({
        message: "Successfully Getting Warehouse Data",
        data: response,
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "Server Error Getting Warehouse",
      })
    }
  },
  query: async (req, res) => {
    try {
      const {
        origin,
        destination,
        weight,
        courier,
      } = req.body;
      axios.defaults.headers.common["key"] = "219e2276d40a703824dea05e2ebfb639"
      axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded"

      return res.status(200).json({
        message: "Successfully Getting User Address",
        data: response,
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "Server Error",
      })
    }
  },
  getWarehouseAddress: async (req, res) => {
    try {
      const response = await Warehouse.findAll()

      return res.status(200).json({
        message: "Successfully Getting Warehouse Data",
        data: response,
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "Server Error Getting Warehouse",
      })
    }
  },
  query: async (req, res) => {
    try {
      const { origin, destination, weight, courier } = req.body
      axios.defaults.headers.common["key"] = process.env.RAJAONGKIR_API_KEY
      axios.defaults.headers.post["Content-Type"] = process.env.AXIOS_HEADERS

      const response = await axios.post(process.env.BASE_URL_RAJAONGKIR_COST, {
        origin,
        destination,
        weight,
        courier,
      })

      const responseData = response.data
      const results = response.data.rajaongkir.results

      return res.status(200).json({
        message: "Successfully getting query",
        data: responseData,
        results: results,
      })
    } catch (error) {
      console.log(error)
      return res.status(400).json({
        message: "Bad request error getting query",
      })
    }
  },
}

module.exports = shipmentController