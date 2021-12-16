const app = require('./app')
const logger = require('./logger')
const port = process.env.PORT

app.listen(port, () => logger.info("SERVER", 'server is on port ' + port))

