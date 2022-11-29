const axios = require("axios")
const db = require("../models")
const Address = db.Address

const addressController = {
  getAddressById: async (req, res) => {
    try {
      const response = await Address.findAll({
        where: {
          UserId: req.user.id,
        },
        order: [["is_default", "DESC"]],
      })

      return res.status(200).json({
        message: "Get User Address",
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

      const RajaOngkirKey = "e216ad3d4659076abbc64528fa8a712d"
      const provinceAndCity = await axios.get(
        `https://api.rajaongkir.com/starter/city?id=${city}&province=${province}&key=${RajaOngkirKey}`
      )

      const provinceName = provinceAndCity.data.rajaongkir.results.province
      const cityName = provinceAndCity.data.rajaongkir.results.city_name
      const cityType = provinceAndCity.data.rajaongkir.results.type
      const cityNameAndType = `${cityType} ${cityName}`

      const key = "6833b88f6e234551a37c6dcb7f4de083"
      const location = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?key=${key}&q=${districts},${cityNameAndType},${provinceName}`
      )

      const latitude = location.data.results[0].geometry.lat
      const longitude = location.data.results[0].geometry.lng

      const response = await Address.create({
        recipients_name,
        phone_number,
        address_labels,
        province: provinceName,
        city: cityNameAndType,
        districts,
        full_address,
        UserId: req.user.id,
        longitude,
        latitude,
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
  updateAddress: async (req, res) => {
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

      const { id } = req.params

      const RajaOngkirKey = "e216ad3d4659076abbc64528fa8a712d"
      const provinceAndCity = await axios.get(
        `https://api.rajaongkir.com/starter/city?id=${city}&province=${province}&key=${RajaOngkirKey}`
      )

      const provinceName = provinceAndCity.data.rajaongkir.results.province
      const cityName = provinceAndCity.data.rajaongkir.results.city_name
      const cityType = provinceAndCity.data.rajaongkir.results.type
      const cityNameAndType = `${cityType} ${cityName}`

      const key = "6833b88f6e234551a37c6dcb7f4de083"
      const location = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?key=${key}&q=${districts},${cityNameAndType},${provinceName}`
      )

      const latitude = location.data.results[0].geometry.lat
      const longitude = location.data.results[0].geometry.lng

      await Address.update(
        {
          recipients_name,
          phone_number,
          address_labels,
          province,
          city,
          districts,
          full_address,
          longitude,
          latitude,
        },
        {
          where: {
            id: id,
          },
        }
      )
      const findData = await Address.findByPk(id)
      return res.status(200).json({
        message: "Address Edited",
        data: findData,
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "Server Error",
      })
    }
  },
  deleteAddress: async (req, res) => {
    try {
      const { id } = req.params

      await Address.destroy({
        where: {
          id: id,
        },
      })

      return res.status(200).json({
        message: "Address Deleted",
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "Server Error",
      })
    }
  },
  setAsDefault: async (req, res) => {
    try {
      const { id } = req.params
      const findDefault = await Address.findOne({
        where: {
          is_default: true,
          UserId: req.user.id,
        },
      })
      if (findDefault) {
        await Address.update(
          {
            is_default: false,
          },
          {
            where: {
              id: findDefault.id,
            },
          }
        )

        await Address.update(
          {
            is_default: true,
          },
          {
            where: {
              id: id,
            },
          }
        )
        return res.status(200).json({
          message: "Success",
        })
      }
      if (!findDefault) {
        await Address.update(
          {
            is_default: true,
          },
          {
            where: {
              id: id,
            },
          }
        )
        return res.status(200).json({
          message: "Success",
        })
      }

      return res.status(200).json({
        message: "Set as default",
        daat: findDefault,
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "Server Error",
      })
    }
  },
}

module.exports = addressController
