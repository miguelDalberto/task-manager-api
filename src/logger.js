const getTimestamp = () => new Date().toISOString()

const info = (namespace, message, object) => {
  if (object) {
    console.log(`[${getTimestamp()}] [INFO] [${namespace}] ${message}`, object)
  } else {
    console.log(`[${getTimestamp()}] [INFO] [${namespace}] ${message}`)
  }
}
const warn = (namespace, message, object) => {
  if (object) {
    console.log(`[${getTimestamp()}] [WARN] [${namespace}] ${message}`, object)
  } else {
    console.log(`[${getTimestamp()}] [WARN] [${namespace}] ${message}`)
  }
}
const debug = (namespace, message, object) => {
  if (object) {
    console.log(`[${getTimestamp()}] [DEBUG] [${namespace}] ${message}`, object)
  } else {
    console.log(`[${getTimestamp()}] [DEBUG] [${namespace}] ${message}`)
  }
}
const error = (namespace, message, object) => {
  if (object) {
    console.log(`[${getTimestamp()}] [ERROR] [${namespace}] ${message}`, object)
  } else {
    console.log(`[${getTimestamp()}] [ERROR] [${namespace}] ${message}`)
  }
}

module.exports = { info, warn, debug, error }
