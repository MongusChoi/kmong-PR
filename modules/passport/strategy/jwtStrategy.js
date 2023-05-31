const { Strategy, ExtractJwt } = require('passport-jwt')
const { SECRET } = require('../../../global')
const UserDB = require('../../../models/users')

module.exports = new Strategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: SECRET,
    issuer: 'WSP'
}, async (payload, done) => {
    try {
        const isExist = await UserDB.IsExist({ _id: payload._id })
        if (!isExist) done(null, false)
        else done(null, { _id: payload._id })
    }
    catch (e) {
        done(null, { error: e })
    }
})