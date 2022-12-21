const db = require("../models");
// import axios from "axios"
const axios = require("axios");
const { Op } = require("sequelize");
const pool = require("../config/connectionConfig");
const fastcsv = require("fast-csv");
const mysql = require("mysql");

const fs = require("fs");
const ws = fs.createWriteStream("product_stock.csv");

const exportController = {
  showAllStockData: async (req, res) => {
    try {
      const {
        id = "",
        _sortBy = "id",
        _sortDir = "ASC",
        _limit = 6,
        _page = 1,
        currentTime,
        endTime,
      } = req.query;

      const findAdminById = await db.User.findByPk(req.user.id);

      if (findAdminById.RoleId !== 3) {
        return res.status(400).json({
          message: "User unauthorized",
        });
      }

      const response = await db.Journal.findAndCountAll({
        limit: Number(_limit),
        offset: (_page - 1) * _limit,
        order: [[_sortBy, _sortDir]],
        include: [{ model: db.Type_Journal }, { model: db.Product }],
        where: {
          id: {
            [Op.like]: `%${id}%`,
          },
          createdAt: {
            [Op.between]: [currentTime, endTime],
          },
        },
      });
      return res.status(200).json({
        message: "Successfully getting stock data",
        data: response.rows,
        dataCount: response.count,
      });
      // }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Server error when getting stock data",
      });
    }
  },

  exportcsv: async (req, res) => {
    try {
      console.log(req.query);
      const { currentTime, endTime } = req.query;
      let sqlQuery = `SELECT SJ.*, TJ.name, TJ.type, P.product_name FROM journals AS SJ LEFT JOIN Type_journals AS TJ ON SJ.TypeJournalId = TJ.id JOIN Products AS P ON SJ.ProductId = P.id WHERE SJ.createdAt BETWEEN '${currentTime}' AND '${endTime}'`
      pool.query(sqlQuery, function (err, data) {
          if (err) throw err;

          //JSON
          const jsonData = JSON.parse(JSON.stringify(data));
          //   console.log("jsonData", jsonData);

          //csv
          fastcsv
            .write(jsonData, { headers: true })
            .on("finish", function () {
              console.log(
                "Write to product_stock.csv successfully in server folder!"
              );
            })
            .pipe(ws);

          res.send("All process is done!");
        }
      );
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Server error when getting stock data",
      });
    }
  },
};

module.exports = exportController;
