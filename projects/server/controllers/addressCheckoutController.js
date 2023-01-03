const axios = require("axios")
const { Op } = require("sequelize")
const db = require("../models")

const RajaOngkirKey = process.env.RAJAONGKIR_API_KEY
const OpenCageKey = process.env.OPENCAGE_API_KEY

const addressCheckoutController = {
  getMainAddress: async (req, res) => {
    try {
      const response = await db.Address.findOne({
        where: {
          UserId: req.user.id,
          is_default: true,
        },
      })

      return res.status(200).json({
        message: "Get Main Address",
        data: response,
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "Server Error",
      })
    }
  },
  getAllAddress: async (req, res) => {
    try {
      const { recipients_name = "", full_address = "" } = req.query

      if (recipients_name || full_address) {
        const response = await db.Address.findAll({
          where: {
            UserId: req.user.id,
            [Op.or]: {
              recipients_name: {
                [Op.like]: `%${recipients_name}%`,
              },
              full_address: {
                [Op.like]: `%${full_address}%`,
              },
            },
          },
          order: [["is_default", "DESC"]],
        })

        return res.status(200).json({
          message: "Get User Address by name and full address",
          data: response,
        })
      }

      const response = await db.Address.findAll({
        where: {
          UserId: req.user.id,
        },
        order: [["is_default", "DESC"]],
      })

      return res.status(200).json({
        message: "Get All Address",
        data: response,
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "Server Error",
      })
    }
  },
  addNewAddress: async (req, res) => {
    try {
      const {
        recipients_name,
        phone_number,
        address_labels,
        province,
        city,
        districts,
        full_address,
      } = req.body

      const provinceAndCity = await axios.get(
        `https://api.rajaongkir.com/starter/city?id=${city}&province=${province}&key=${RajaOngkirKey}`
      )

      const provinceName = provinceAndCity.data.rajaongkir.results.province
      const cityName = provinceAndCity.data.rajaongkir.results.city_name
      const cityType = provinceAndCity.data.rajaongkir.results.type
      const cityNameAndType = `${cityType} ${cityName}`

      const location = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?key=${OpenCageKey}&q=${districts},${cityNameAndType},${provinceName}`
      )

      const latitude = location.data.results[0].geometry.lat
      const longitude = location.data.results[0].geometry.lng

      const response = await db.Address.create({
        recipients_name,
        phone_number,
        address_labels,
        provinceId: province,
        province: provinceName,
        cityId: city,
        city: cityNameAndType,
        districts,
        full_address,
        UserId: req.user.id,
        longitude,
        latitude,
        is_default: true,
      })

      return res.status(200).json({
        message: "New Address",
        data: response,
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "Server Error",
      })
    }
  },
}

module.exports = addressCheckoutController
