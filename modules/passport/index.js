const passport = require('passport')

const jwt = require('./strategy/jwtStrategy')
const local = require('./strategy/localStrategy')

passport.use('jwt', jwt)
passport.use('local', local)

passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((user, done) => done(null, user))

module.exports = passport