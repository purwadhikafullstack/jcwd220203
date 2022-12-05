// const { axiosInstance } = require("../../client/src/api");
// const { axiosInstance } = require("../../client/src/api/index");
const db = require("../models");
// import axios from "axios"
const axios = require("axios")
const { Op } = require("sequelize");


const warehouseController = {
  getAllWarehouseData: async (req, res) => {
    try {
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
      });
      // console.log(totalRows)
      
      const totalPage = Math.ceil(totalRows / limit);
      // console.log(offset)
      const findWarehouse = await db.Warehouse.findAll(
        {
        where: {
          [Op.or]: [
            { warehouse_name: { [Op.like]: "%" + search + "%" } },
            { address_labels: { [Op.like]: "%" + search + "%" } },
          ],
        },
        include: [{model: db.User}],
        offset: offset,
        limit: limit,
      });
      return res.status(200).json({
        message: "Warehouse data found!",
        data: findWarehouse,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      });
    } catch (err) {
      return res.status(500).json({
        message: "Server error get all warehouse",
      });
    }
  },
  addWarehouseData: async (req, res) => {
    try {
      const { warehouse_name, address } = req.body;
      const key = "90eb0535a1c742b89d44eee5c92b7909";
      const location = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${address}&key=${key}`
      );
      const locationResult = location.data.results[0].formatted
      const state = location.data.results[0].components.state
      const lat = location.data.results[0].geometry.lat
      const lng = location.data.results[0].geometry.lng
      const data = await db.Warehouse.create(
        {
          warehouse_name,
          address: locationResult,
          state,
          latitude: lat,
          longitude: lng,
        },
      );
      return res.status(200).json({
        message: "Created new warehouse",
        data: data,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Server error adding new warehouse",
      });
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

      const RajaOngkirKey = "219e2276d40a703824dea05e2ebfb639"
      const provinceAndCity = await axios.get(
        `https://api.rajaongkir.com/starter/city?id=${city}&province=${province}&key=${RajaOngkirKey}`
      )
      const provinceName = provinceAndCity.data.rajaongkir.results.province
      const cityName = provinceAndCity.data.rajaongkir.results.city_name
      const cityType = provinceAndCity.data.rajaongkir.results.type
      const cityNameAndType = `${cityType} ${cityName}`
      
      const key = "90eb0535a1c742b89d44eee5c92b7909"
      const location = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?key=${key}&q=${districts},${cityNameAndType},${provinceName}`
        )

      const latitude = location.data.results[0].geometry.lat
      const longitude = location.data.results[0].geometry.lng

      const response = await db.Warehouse.create({
        warehouse_name,
        address_labels,
        province: provinceName,
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
      const { warehouse_name, address } = req.body;

      await db.Warehouse.update(
        {
          warehouse_name,
          address,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );
      return res.status(200).json({
        message: "Updated this book",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Server error editing warehouse",
      });
    }
  },
  deleteWarehouseData: async (req, res) => {
    try {
      await db.Warehouse.destroy({
        where: {
          id: req.params.id,
        },
      });
      return res.status(200).json({
        message: "Warehouse deleted",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Server error get all warehouse",
      });
    }
  },
  getLocation: async (req, res) => {
    try {
      


    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "Server error on getting location"
      })
    }
  }
};

module.exports = warehouseController;
