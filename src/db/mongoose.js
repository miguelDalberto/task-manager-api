const mongoose = require('mongoose')
const logger = require('../logger')

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: true
})

logger.info('DATABASE', 'connected to mongodb database')
