const db = require("../models")
const Address = db.Address

const addressController = {
  getAddressById: async (req, res) => {
    try {
      const response = await Address.findAll({
        where: {
          UserId: req.user.id,
        },
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

      const response = await Address.create({
        recipients_name,
        phone_number,
        address_labels,
        province,
        city,
        districts,
        full_address,
        UserId: req.user.id,
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

      await Address.update(
        {
          recipients_name,
          phone_number,
          address_labels,
          province,
          city,
          districts,
          full_address,
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
}

module.exports = addressController
