const logger = require('./logger')
const requestLogger = (request, response, next) =>{
  logger.info('method', request.method)
  logger.info('path', request.path)
  logger.info('body', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'Unknown Endpoint'})
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({error: 'Malformated Id'})
  } else if(error.name === 'ValidationError'){
    return response.status(400).json({error: error.mesage})
  }

  next(error)
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')

  
  if(authorization && authorization.toLowerCase().startsWith('bearer ')){
    req.token = authorization.substring(7)
  }
  
  next()
}

module.exports = {
  requestLogger, unknownEndpoint, errorHandler, tokenExtractor
}