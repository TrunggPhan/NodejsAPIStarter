const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy
const {JWT_SECRET} = require('../config')

const User = require('../models/User')

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET
}, async (payload, done) => {
    try {
        console.log("payload = ", payload)
        const user = await User.findById(payload.sub)
        if(!user) return done(null, false)
        else return done(null, user)

    }catch (err) {
        done(err, false)
    }
}))

//passport-local
passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    try {
        console.log("password: ", password)
        const user = await User.findOne({email})
        if(!user) return done(null, false)
        const isValidPassword = await user.isValidPassword(password)
        if(!isValidPassword) return done(null, false)
        console.log("user after passport-local:", user)
        return done(null, user)
    }catch (err) {
        done(err, false)
    }
}))
