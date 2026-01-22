require('dotenv').config()

const db = require('knex')({
  client: 'mysql2',
  connection: {
    host: process.env.HOST || 'db',
    user: process.env.USER || 'root',
    password: process.env.PW || '1234',
    database: process.env.DB_NAME || 'estimate01',
    dateStrings: true
  }
})

module.exports = db

