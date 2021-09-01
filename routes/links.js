const router = require('express').Router()
const verify = require('./verifyToken')
const User = require('../model/User')

router.get('/', verify, async (req, res) => {
    const user = await User.findOne({_id: req.user._id})
    res.status(200).send(user.links)
})

router.post('/', verify, async (req, res) => {
    const newLink = {
        title: req.body.title,
        url: req.body.url
    }
    
    const user = await User.findOne({_id: req.user._id})
    user.links.push(newLink)
    user.save()
    res.send(user.links)
})

router.put('/:id', verify, async (req, res) => {
    const id = req.params.id
    const newTitle = req.body.title
    const user = await User.findOne({_id: req.user._id})
    const link = user.links.id(id)
    link.title = newTitle
    user.save()
    res.send(link)
})

router.delete('/:id', verify, async (req, res) => {
    const id = req.params.id
    const user = await User.findOne({ _id: req.user._id })
    user.links.id(id).remove()
    user.save()
    res.send(user)
})

module.exports = router