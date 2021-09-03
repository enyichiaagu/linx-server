const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require("cors")
//Import Routes
const authRoute = require('./routes/auth')
const linkRoute = require('./routes/links')

dotenv.config()

// Connect DB
mongoose.connect(
    process.env.DB_CONNECT,
    { useNewUrlParser: true },
    () =>console.log('connected to DB')
)

//Middlewares
app.use(express.json())
app.use(cors())
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.get('/', (req, res) => {
    res.send('<h1>Is this even working?</h1>')
})

//Route Middlewares
app.use('/api/user', authRoute)
app.use('/api/links', linkRoute)

app.listen(process.env.PORT, () => console.log("Server up and running"))