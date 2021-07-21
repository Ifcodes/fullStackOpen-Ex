const config = require('./utils/config')
const express = require('express')
const app = express()
const blogRouter = require('./controller/blogList')
const cors = require('cors')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

logger.info('connecting to', config.URL)

mongoose.connect(config.URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
}).then(() => {
  logger.info('connected to MongoDB')
}).catch(error => {
  logger.info('connecting to MongoDB failed!', error.message)
})

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use('/api/blogs', blogRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandlers)


module.exports = app