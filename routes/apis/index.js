const router = require('express').Router()

const paths = [
    '/user',
    '/project'
]

paths.forEach(path => router.use(path, require(`.${path}`)))

module.exports = router