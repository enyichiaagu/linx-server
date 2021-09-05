const router = require('express').Router()
const verify = require('./verifyToken')
const User = require('../model/User')

router.get('/', verify, async (req, res) => {
    const user = await User.findOne({_id: req.user._id})
    res.status(200).send(user.links.reverse())
})

router.post('/', verify, async (req, res) => {
    const newLink = {
        id: req.body.id,
        title: req.body.title,
        url: req.body.url
    }
    
    const user = await User.findOne({_id: req.user._id})
    user.links.push(newLink)
    user.save()
    res.send(user.links.reverse())
})

router.put('/:id', verify, async (req, res) => {
    try {
        const id = req.params.id
        const newTitle = req.body.title
        const user = await User.findOne({_id: req.user._id})
        const link = user.links.id(id)
        console.log(user.links )
        link.title = newTitle
        user.save()
        res.send(user.links.reverse())
    } catch(err) {
        res.send({error: "Internal Server error"})
    }
})

router.delete('/:id', verify, async (req, res) => {
    const id = req.params.id
    const user = await User.findOne({ _id: req.user._id })
    user.links.id(id).remove()
    user.save()
    res.send({"success": "Link was deleted successfully"})
})

module.exports = router