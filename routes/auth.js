const router = require('express').Router()
const User = require('../model/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const verify = require('./verifyToken')

router.get('/', verify, async (req, res) => {
    try {
        const user = await User.findOne({_id: req.user._id})
        res.send({
            name: user.name,
            links: user.links.reverse()
        })
    } catch (err) {
        res.send({error: "server error"})
    }
})

router.post('/register', async (req, res)=> {
    //Check if user is in the database
    const nameExist = await User.findOne({name: req.body.name})
    if (nameExist) return res.status(400).send({name: 'User already exists'})

    //Hash the password
    // const salt = await bcrypt.genSalt(10)
    const hashedPassword = bcrypt.hashSync(req.body.password, 10)

    const user = new User({
        name: req.body.name,
        password: hashedPassword
    })

    try {
        const savedUser = await user.save()
        res.send({user: user._id})
    } catch(err) {
        res.status(400).send({error: 'error occurred'})
    }
})

router.post('/login', async (req, res) => {
    try {
        //Check if user is in the database
        const user = await User.findOne({name: req.body.name})
        if (!user) return res.status(400).send({credentials: "Wrong credentials"})
        //Check if password is correct
        const validPass = await bcrypt.compare(req.body.password, user.password)
        if (!validPass) return res.status(400).send({credentials: "Wrong credentials"})

        //Create and assign a token
        const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
        res.header('auth', token)

        res.send({success: "Logged in", auth: token})
    } catch(e) {
        res.send({error: 'something happened!'})
    }
})

module.exports = router