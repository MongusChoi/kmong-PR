const express = require('express')
const session = require('express-session')
const cors = require('cors')
const app = express()
const server = require('http').Server(app)
const passport = require('./modules/passport')

const global = require('./global')

const port = process.env.PORT || 2008

app.use(cors())
app.use(express.json())

app.use(session({ maxAge: 86400000, secret: `secret`, resave: true, saveUninitialized: true }))

app.use(passport.initialize())
app.use(passport.session())

app.use('/apis', require('./routes/apis'))

server.listen(port, function () {
    console.log('[system] Open | Port : ' + port)
})

///////////////////////// ▼ DB 접근 ▼ /////////////////////////
const mongoose = require('mongoose')
mongoose.connect(global.MONGO_CONNECTION_STRING, { dbName: 'DataBase' })

const db = mongoose.connection
db.on('error', console.error)
db.once('open', () => {
    console.log('[system] mongodb connect')
})