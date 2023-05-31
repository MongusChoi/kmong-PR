const router = require('express').Router()
const passport = require('passport')
const controller = require('./user.controller')

router.post('/sign-up', controller.SignUp)
router.post('/sign-in', passport.authenticate('local'), controller.SignIn)

router.use('*', passport.authenticate('jwt'))

router.get('/:id', controller.GetUserData)

module.exports = router