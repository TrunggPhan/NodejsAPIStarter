const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const {JWT_SECRET, auth} = require('../config')

const User = require('../models/User')

//passport Google
passport.use(new GooglePlusTokenStrategy({
    clientID: auth.google.CLIENT_ID,
    clientSecret: auth.google.CLIENT_SECRET,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log("accessToken: ", accessToken)
        console.log("refreshToken: ", refreshToken)
        console.log("profile: ", profile)
        //check if user exist in database
        const user = await User.findOne({authGoogleID: profile.id, authType: 'google'})
        if(user) return done(null, user)

        //if is new User
        const newUser = new User({
            authType: 'google',
            authGoogleID: profile.id,
            email: profile.emails[0].value
        })
        await newUser.save()
        done(null, newUser)

    }catch (err) {
        done(err, false)
    }
}))

//passport jwt
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
        const user = await User.findOne({email})
        if(!user) return done(null, false)
        const isValidPassword = await user.isValidPassword(password)
        if(!isValidPassword) return done(null, false)
        return done(null, user)
    }catch (err) {
        done(err, false)
    }
}))
