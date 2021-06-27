const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')

const UserSchema = new Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    decks: [{
        type: Schema.Types.ObjectId,
        ref: 'Deck'
    }]
})

UserSchema.pre('save', async function (next){
    //generate a salt
    const salt = await bcrypt.genSalt(10)
    //generate password hash
    const passwordHash = await bcrypt.hash(this.password, salt)
    console.log("password: ", this.password, ", pasHash: ", passwordHash)
    //re-assign password hashed
    this.password = passwordHash
})

UserSchema.methods.isValidPassword = async function(newPassword) {
    try {
        return await bcrypt.compare(newPassword, this.password)
    }catch (err) {
        throw new Error(err)
    }
}

const User = mongoose.model('User', UserSchema)

module.exports = User
