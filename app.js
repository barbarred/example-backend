const config = require('./utils/config.js')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const notesRouter = require('./controllers/notes.js')
const usersRouter = require('./controllers/users.js')
const middleware = require('./utils/middleware.js')
const logger = require('./utils/logger.js')
const mongoose = require('mongoose')


mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB', error.message)
  })

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter )

app.use(middleware.unknowEndpoint)
app.use(middleware.errorHandler)

module.exports = app
