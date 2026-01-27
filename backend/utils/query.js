const db = require('../config/db')

// Function รวมชื่อ
const fn = (a = 'u', al = 'fullName') => db.raw(`CONCAT( ${a}.fname,' ', ${a}.lname) as ${al}`)

// Function ติดตามสถานะ
const trackStatus = (role , userField) => {
    db('assignments as a')
        .join('')
}

module.exports = {fn}