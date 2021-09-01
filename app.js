const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
//Import Routes
const authRoute = require('./routes/auth')
const linkRoute = require('./routes/links')

dotenv.config()

//Connect DB
mongoose.connect(
    process.env.DB_CONNECT,
    { useNewUrlParser: true },
    () =>console.log('connected to DB')
)

//Middlewares
app.use(express.json())
app.use(cors())

//Route Middlewares
app.use('/api/user', authRoute)
app.use('/api/links', linkRoute)

app.listen(5000, () => console.log("Server up and running"))