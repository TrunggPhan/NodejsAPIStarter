const User = require('../models/User')
const Deck = require('../models/Deck')
//Validate data
const Joi = require('joi')
const JWT = require('jsonwebtoken')
const config = require('../config')

const encodedToken = (userId) => {
    return JWT.sign({
        iss: 'Trung',
        sub: userId,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 3)
    }, config.JWT_SECRET)
}

const idSchema = Joi.object({
    userId: Joi.string().regex(/^\w{24}$/).required()
})

const authGoogle = async (req, res, next) => {
    console.log("authGoogle: ", req.user)
    const token = encodedToken(req.user._id)
    res.setHeader('Authorization', token)
    return res.status(200).json({success: true})
}

// test unlock secret code - test configs of passport (payload)
const secret = async (req, res, next) => {
    return res.status(200).json({resources: true})
}

const signIn = async (req, res, next) => {
    console.log("signIn called")
    const token = encodedToken(req.user._id)
    res.setHeader('Authorization', token)
    return res.status(200).json({success: true})
}

const signUp = async (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;
    const findEmailExist = await User.findOne({email})
    if(findEmailExist) return res.status(403).json({error: "This email is existed"})
    const newUser = new User({firstName, lastName, email, password})
    await newUser.save();
    //encode a token
    const token = encodedToken(newUser._id)
    //set token in Header
    res.setHeader('Authorization', token)
    return res.status(201).json({message: " success!"})
}

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
    authGoogle,
    index,
    newUser,
    newDeck,
    getDecksByUser,
    getUser,
    updateUser,
    replaceUser,
    signIn,
    signUp,
    secret
}
