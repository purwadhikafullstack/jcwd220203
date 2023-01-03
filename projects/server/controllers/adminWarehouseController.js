// const { axiosInstance } = require("../../client/src/api");
// const { axiosInstance } = require("../../client/src/api/index");
const db = require("../models")
// import axios from "axios"
const axios = require("axios")
const { Op } = require("sequelize")

const adminWarehouseController = {
  getAllWarehouseData: async (req, res) => {
    try {
      const _sortBy = req.query._sortBy
      const _sortDir = req.query._sortDir
      const page = parseInt(req.query._page) || 0
      const limit = parseInt(req.query._limit) || 20
      const search = req.query._keywordHandler || ""
      const offset = limit * page

      const totalRows = await db.Warehouse.count({
        where: {
          [Op.or]: [
            { warehouse_name: { [Op.like]: "%" + search + "%" } },
            { address_labels: { [Op.like]: "%" + search + "%" } },
          ],
        },
      })
      // console.log(totalRows)

      const totalPage = Math.ceil(totalRows / limit)
      // console.log(offset)
      const findWarehouse = await db.Warehouse.findAll({
        where: {
          [Op.or]: [
            { warehouse_name: { [Op.like]: "%" + search + "%" } },
            { address_labels: { [Op.like]: "%" + search + "%" } },
          ],
        },
        order: [[_sortBy, _sortDir]],
        include: [{ model: db.User }],
        offset: offset,
        limit: limit,
      })
      return res.status(200).json({
        message: "Warehouse data found!",
        data: findWarehouse,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      })
    } catch (err) {
      return res.status(500).json({
        message: "Server error get all warehouse",
      })
    }
  },

  addNewWarehouse: async (req, res) => {
    try {
      const {
        warehouse_name,
        address_labels,
        province,
        city,
        districts,
        full_address,
      } = req.body

      const RajaOngkirKey = process.env.RAJAONGKIR_API_KEY
      const provinceAndCity = await axios.get(
        `https://api.rajaongkir.com/starter/city?id=${city}&province=${province}&key=${RajaOngkirKey}`
      )
      const provinceName = provinceAndCity.data.rajaongkir.results.province
      const cityName = provinceAndCity.data.rajaongkir.results.city_name
      const cityType = provinceAndCity.data.rajaongkir.results.type
      const cityNameAndType = `${cityType} ${cityName}`

      const key = process.env.OPENCAGE_API_KEY
      const location = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?key=${key}&q=${districts},${cityNameAndType},${provinceName}`
      )

      const latitude = location.data.results[0].geometry.lat
      const longitude = location.data.results[0].geometry.lng

      const response = await db.Warehouse.create({
        warehouse_name,
        address_labels,
        provinceId: province,
        province: provinceName,
        cityId: city,
        city: cityNameAndType,
        districts,
        full_address,
        longitude,
        latitude,
      })

      return res.status(200).json({
        message: "Successfully Added New Address",
        data: response,
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "Server Error Adding New Address",
      })
    }
  },
  editWarehouseData: async (req, res) => {
    try {
      const {
        warehouse_name,
        address_labels,
        province,
        city,
        districts,
        full_address,
      } = req.body

      const RajaOngkirKey = process.env.RAJAONGKIR_API_KEY
      const provinceAndCity = await axios.get(
        `https://api.rajaongkir.com/starter/city?id=${city}&province=${province}&key=${RajaOngkirKey}`
      )
      const provinceName = provinceAndCity.data.rajaongkir.results.province
      const cityName = provinceAndCity.data.rajaongkir.results.city_name
      const cityType = provinceAndCity.data.rajaongkir.results.type
      const cityNameAndType = `${cityType} ${cityName}`

      const key = process.env.OPENCAGE_API_KEY
      const location = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?key=${key}&q=${districts},${cityNameAndType},${provinceName}`
      )

      const latitude = location.data.results[0].geometry.lat
      const longitude = location.data.results[0].geometry.lng

      await db.Warehouse.update(
        {
          warehouse_name,
          address_labels,
          provinceId: province,
          province: provinceName,
          cityId: city,
          city: cityNameAndType,
          districts,
          full_address,
          longitude,
          latitude,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      )
      return res.status(200).json({
        message: "Updated this book",
      })
    } catch (error) {
      return res.status(500).json({
        message: "Server error editing warehouse",
      })
    }
  },
  deleteWarehouseData: async (req, res) => {
    try {
      await db.Warehouse.destroy({
        where: {
          id: req.params.id,
        },
      })
      return res.status(200).json({
        message: "Warehouse deleted",
      })
    } catch (error) {
      return res.status(500).json({
        message: "Server error get all warehouse",
      })
    }
  },
  getLocation: async (req, res) => {
    try {
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "Server error on getting location",
      })
    }
  },
}

module.exports = adminWarehouseController
