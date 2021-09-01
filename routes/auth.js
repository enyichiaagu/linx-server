const router = require('express').Router()
const User = require('../model/User')
const { registerValidation, loginValidation } = require('../validation')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const verify = require('./verifyToken')

router.get('/', verify, (req, res) => {
    res.send(req.user)
    User.findOne({_id: req.user._id})
})

router.post('/register', async (req, res)=> {

    //User Validation
    const { error } = registerValidation(req.body, User)
    if (error) return res.status(400).send(error.details[0].message)

    //Check if user is in the database
    const nameExist = await User.findOne({name: req.body.name})
    if (nameExist) return res.status(400).send('User already exists')

    //Hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const user = new User({
        name: req.body.name,
        password: hashedPassword
    })
    try {
        const savedUser = await user.save()
        res.send({user: user._id})
    } catch(err) {
        res.status(400).send(err)
    }
})

router.post('/login', async (req, res) => {
    //User Validation
    const { error } = loginValidation(req.body, User)
    if (error) return res.status(400).send(error.details[0].message)

    //Check if user is in the database
    const user = await User.findOne({name: req.body.name})
    if (!user) return res.status(400).send('Email or password is wrong')
    //Check if password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password)
    if (!validPass) return res.status(400).send('Email or password is wrong')

    //Create and assign a token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
    res.header('auth-token', token)

    res.send('logged in!')
})

module.exports = router