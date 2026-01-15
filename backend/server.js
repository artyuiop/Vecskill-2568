// import pagekage
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()

// import routes
const auth = require('./routes/auth')
const evaluations = require('./routes/evaluations')
const user = require('./routes/users')
const indicators = require('./routes/indicators')

// middleware
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))


// use routes
app.use('/api/auth', auth)
app.use('/api/evaluations', evaluations)
app.use('/api/users', user)
app.use('/api/indicators', indicators)

// Page NotFound
app.use((req ,res) => {
    res.status(404).json({message: "Page NotFound 404"})
})


app.listen(5000, () => console.log('Server Runing! On Port 5000'))