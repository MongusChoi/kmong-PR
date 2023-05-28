const fs = require('fs')
const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const app = express()
const server = require('http').Server(app)

// const global = require('./global')

const port = process.env.PORT || 2008
// const passport = require('./_oldcode/middlewares/auth')

app.use(cors())
app.use(bodyParser.urlencoded({ limit: '4096mb', extended: true, parameterLimit: 500000000 }))
app.use(cookieParser())

app.use(session({ maxAge: 86400000, secret: `secret`, resave: true, saveUninitialized: true }))

// app.use(passport.initialize())
// app.use(passport.session())

// app.use('/apis', require('./routes/apis'))

server.listen(port, function () {
    console.log('[system] Open | Port : ' + port)
})

///////////////////////// ▼ DB 접근 ▼ /////////////////////////
// const mongoose = require('mongoose')
// mongoose.connect(global.MONGO_CONNECTION_STRING, { useNewUrlParser: true, autoReconnect: true, reconnectTries: Number.MAX_VALUE, reconnectInterval: 1000, dbName: 'VideoMonster' })

// const db = mongoose.connection
// db.on('error', console.error)
// db.once('open', () => {
//     console.log('[system] mongodb connect')
// })