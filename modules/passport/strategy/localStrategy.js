const LocalStrategy = require('passport-local');
const UserDB = require('../../../models/users');

module.exports = new LocalStrategy(
    {
        usernameField:'id',
        passwordField:'password',
        session:false
    }, 
    async (id, password, done) => {
        const verifyResult = await UserDB.IsVerify({ id, password })
        if (!verifyResult.result) {
            return done(null, false)
        }
        return done(null, verifyResult.user)
    }
);