const send = (res , data , code = 200) => res.status(code).json(data)
const err = (res, e , msg = 'Server Error') => (console.log(e), send(res, {msg}, 500))


// ทำ status true fasle
module.exports = {send , err}