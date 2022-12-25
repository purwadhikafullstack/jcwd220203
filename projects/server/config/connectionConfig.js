const mysql = require('mysql');
const config = require('./config.json')

const pool = mysql.createPool({
    connectionLimit: 100,
    host: config.development.host,
    user: config.development.username,
    password: config.development.password,
    database: config.development.database,
    port: '3306'
});

module.exports = pool;