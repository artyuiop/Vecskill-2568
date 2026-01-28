const path = require('path')
const multer = require('multer')

exports.upload = multer({
    storage: multer.diskStorage({
        destination: 'uploads/',
        filename: (_ , f , cb) => cb(null , Date.now() + path.extname(f.originalname))
    })
})