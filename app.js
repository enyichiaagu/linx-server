const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require("cors")
const auth = require('./routes/auth')
const link = require('./routes/links')
const bodyParser = require('body-parser')

app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())
dotenv.config()

// Connect DB
mongoose.connect(
    process.env.DB_CONNECT,
    { useNewUrlParser: true },
    () =>console.log('connected to DB')
)

app.get('/', (req, res) => {
    res.send({data: "Success!"})
})

app.use('/api/auth/', auth)
app.use('/api/link/', link)

app.listen(process.env.PORT, () => console.log("Server up and running"))
