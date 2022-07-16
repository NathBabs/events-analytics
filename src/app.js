// require dotenv to load environment variables
require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const { logger: log } = require('./utils/logger')
const morgan = require('morgan')
const cors = require('cors')
const routes = require('./routes')

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    return res.send(
        `Welcome 👋 To Your All-in-One Page Events Analytics ${
            new Date().toISOString().split('T')[0]
        }`
    )
})

app.use(routes)

app.use((err, req, res, next) => {
    const { message = 'Something went wrong', statusCode = 500 } = err
    return res.status(statusCode).send({
        success: false,
        message: message,
    })
})

module.exports = app
