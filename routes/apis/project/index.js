const router = require('express').Router()
const passport = require('passport')
const controller = require('./project.controller')

router.get('/', controller.GetList)
router.get('/:id', controller.GetItem)

router.use('*', passport.authenticate('jwt'))

router.post('/', controller.Create)
router.patch('/:id', controller.UpdateItem)

router.get('/:id/application', controller.GetApplicationData)
router.put('/:id/application', controller.CreateApplication)
router.patch('/:id/application/apply', controller.ApplyApplication)
router.delete('/:id/application', controller.DeleteApplication)

router.delete('/:id', controller.DeleteProject)

module.exports = router