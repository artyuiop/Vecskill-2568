const mysql = require('mysql2/promise')
require('dotenv').config()

const db = mysql.createPool({
    host: process.env.HOST || 'localhost',
    user: process.env.USER || 'root',
    password: process.env.PW || '',
    database: process.env.DB_NAME || 'estimate01',
    dateStrings: true
})

module.exports = db