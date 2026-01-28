const jwt = require('jsonwebtoken')
const db = require('../config/db')
const { err, send } = require('../utils/help')

exports.AuthCheck  = async(req ,res , next) => {
    try {
        const header = req.headers.authorization
        if(!header) return send(res, {msg: "No Token"}, 403)

        const token = header.split(' ')[1]
        // console.log(token)
        // debugger
        const decode = jwt.verify(token , process.env.KEY)

        
        req.user = decode.payload

        console.log(req.user);
        next()
    } catch(e) {
        err(res ,e, 'Token ไม่ถูก')
    }
}

exports.RoleCheck = (role) => async(req ,res, next) => {
    try {
        const user = await db('users').where({id: req.user.id}).first()
        if(!user || !role.includes(user.role)) return send(res, {msg: "ไม่มีสิทเข้าถึงข้อมูล!"}, 400)
        next()
    }catch(e) {
        err(res, e)
    }
}