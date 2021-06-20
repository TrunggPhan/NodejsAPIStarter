const User = require('../models/User')
const Deck = require('../models/Deck')
//Validate data
const Joi = require('joi')
// const idSchema = Joi.object().keys({
//     userId: Joi.string().regex(/^\w{24}$/).required()
// })
const idSchema = Joi.object({
    userId: Joi.string().regex(/^\w{24}$/).required()
})

// get All Deck
const getDecksByUser = async (req, res, next) => {
    const validatorResult = idSchema.validate(req.params)
    console.log("validatorResult = ",validatorResult)
    const { userId } = req.params
    const user = await User.findById(userId).populate('decks')
    return res.status(200).json({decks : user.decks})
}

//get User by Id
const getUser =  async (req, res, next) => {
    console.log("req.params = ", req.params)
    const { userId } = req.params
    const userInfo = await User.findById(userId)
    return res.status(200).json({userInfo})
}

// get all user
const index = async (req, res, next) => {
        let users = await User.find({})
        return res.status(500).json({users})

}
//add user
const newDeck = async (req, res, next) => {
    const {userId} = req.params
    // create new Deck
    const newDeck = new Deck(req.body);
    //get user by params
    const user = await User.findById(userId)
    console.log("user ", user)
    //assign user as a deck's owner
    newDeck.owner = user
    //save user in Deck
    await newDeck.save()
    //save deck id in user's decks
    user.decks.push(newDeck._id)
    //save user
    await user.save()

    return res.status(201).json({deck: newDeck})



}
//add user
const newUser = async (req, res, next) => {
        const newUser = new User(req.value.body) // or new User(req.body)
        await  newUser.save()
        return res.status(210).json({newUser})
}

const updateUser = async (req, res, next) => {
    console.log("Update User........... ")
    const { userId } = req.params;
    console.log("UserID = ", userId)
    const newUser = req.body
    await User.findByIdAndUpdate(userId, newUser)
    return res.status(200).json({success: true})
}

const replaceUser = async (req, res, next) => {
    console.log("Replace User..........\n")
    const { userId } = req.params;
    console.log("UserID = ", userId)
    const newUser = req.body
    await User.findByIdAndUpdate(userId, newUser)
    return res.status(200).json({success: true})
}

module.exports = {
    index,
    newUser,
    newDeck,
    getDecksByUser,
    getUser,
    updateUser,
    replaceUser
}
