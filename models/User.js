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
      type: String
    },
    authGoogleID: {
      type: String,
      default: null
    },
    authFacebookID: {
        type: String,
        default: null
    },
    authType: {
      type: String,
      enum: ['local', 'google', 'facebook'],
      default: 'local'
    },
    decks: [{
        type: Schema.Types.ObjectId,
        ref: 'Deck'
    }]
})

UserSchema.pre('save', async function (next){

    if(this.auth !== 'local') next()
    //generate a salt
    const salt = await bcrypt.genSalt(10)
    //generate password hash
    const passwordHash = await bcrypt.hash(this.password, salt)
    console.log("password: ", this.password, ", pasHash: ", passwordHash)
    //re-assign password hashed
    this.password = passwordHash
    next()
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
