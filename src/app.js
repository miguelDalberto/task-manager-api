const express = require('express')
// start db
require('./db/mongoose')
// import routers
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
// import logger
const logger = require('./logger')

const NAMESPACE = 'SERVER'

const app = express()

// log requests and responses
app.use((req, res, next) => {
  logger.info(
    NAMESPACE, 
      `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`
  )

  res.on('finish', () => {
    logger.info(
      NAMESPACE,
      `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - ` +
      `IP: [${req.socket.remoteAddress}]`
    )
  })

  next()
})


app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

module.exports = app
