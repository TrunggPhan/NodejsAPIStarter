const User = require('../models/User')
const Deck = require('../models/Deck')
//Validate data
const Joi = require('joi')

const index = async (req,res, next) => {
    const decks = await Deck.find({})
    return res.status(200).json({decks})
}

const newDeck = async (req,res, next) => {
    let deck = req.body;
    const owner = await User.findById(deck.owner)
    delete deck.owner
    deck.owner = owner._id
    console.log("owner deck = ", owner)
    let newDeck = new Deck(deck)
    console.log("newDeck = ", newDeck)
    await newDeck.save()
    owner.decks.push(newDeck._id)
    await owner.save()
    return res.status(201).json(newDeck)
}

const getDeck = async (req,res,next) => {
    const { deckId } = req.params
    console.log("req.params" ,req.params)
    const deck = await Deck.findById(deckId)
    return res.status(200).json({deck})
}
const replaceDeck = async (req,res,next) => {
    const { deckId } = req.params
    const newDeck = req.body
    //remove deckId from old owner
    const oldDeck = await Deck.findById(deckId)
    const oldOwnerId = oldDeck.owner
    const oldOwner = await User.findById(oldOwnerId)
    oldOwner.decks.pull(deckId)
    await oldOwner.save()
    //replace deck
    await Deck.findByIdAndUpdate(deckId, newDeck)
    //update deckId in new owner
    const ownerId = newDeck.owner
    const newOwner = await User.findById(ownerId)
    newOwner.decks.push(deckId)
    await newOwner.save()
    return res.status(200).json({success: true})
}
const updateDeck = async (req,res,next) => {
    const { deckId } = req.params
    const newDeck = req.body
    console.log("newDeck = ", newDeck)
    //remove deckId from old owner if new deck has owner
    if(newDeck.owner){
        const oldDeck = await Deck.findById(deckId)
        const oldOwnerId = oldDeck.owner
        const oldOwner = await User.findById(oldOwnerId)
        oldOwner.decks.pull(deckId)
        await oldOwner.save()
        //update deckId in new owner
        const ownerId = newDeck.owner
        const newOwner = await User.findById(ownerId)
        newOwner.decks.push(deckId)
        await newOwner.save()
    }
    //replace deck
    await Deck.findByIdAndUpdate(deckId, newDeck)
    return res.status(200).json({success: true})
}
const deleteDeck = async (req,res,next) => {
    const {deckId} = req.params
    const deck = await Deck.findById(deckId)
    const ownerId = deck.owner
    const owner = await User.findById(ownerId)
    await deck.remove()
    owner.decks.pull(deckId)
    owner.save()
    return res.status(200).json({success: true})
}

module.exports = {
    index,
    newDeck,
    getDeck,
    updateDeck,
    replaceDeck,
    deleteDeck
}
