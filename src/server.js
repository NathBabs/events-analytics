require('dotenv').config()
const app = require('./app')
const { connectDB } = require('./db/connection')
const port = process.env.PORT || 3000

connectDB()
app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})
