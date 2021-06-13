const User = require('../models/User')

const index = (req, res, next) => {
    User.find({})
        .then(users => {
        return res.status(200).json({users})
        }).catch(err => next(err))
}

const newUser = (req, res, next) => {
    const newUser = new User(req.body)
    newUser.save().then(user => res.status(210).json({user})
    ).catch(err => next(err))
}

module.exports = {
    index,
    newUser
}
