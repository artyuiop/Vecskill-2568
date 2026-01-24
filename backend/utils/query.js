const db = require('../config/db')

const fn = (a = 'u', al = 'fullName') => db.raw(`CONCAT( ${a}.fname,' ', ${a}.lname) as ${al}`)

module.exports = {fn}