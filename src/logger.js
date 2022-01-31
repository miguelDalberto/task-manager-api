const getTimestamp = () => new Date().toISOString()

class Logger {
  constructor(deactivateLogger) {
    if (deactivateLogger) {
      this.lock = true;
    }
  }

  getTimestamp () { return new Date().toISOString() }

  log (namespace, message, object, purpose) {
    if (!this.lock) {
      if (object) {
        console.log(`[${this.getTimestamp()}] [${purpose}] [${namespace}] - ${message},`, object);
      } else {
        console.log(`[${this.getTimestamp()}] [${purpose}] [${namespace}] - ${message}`);
      }

    }
  }

  info (namespace, msg, obj) {
    this.log(namespace, msg, obj, 'INFO');
  }
  warn (namespace, msg, obj) {
    this.log(namespace, msg, obj, 'WARN');
  }
  debug (namespace, msg, obj) {
    this.log(namespace, msg, obj, 'DEBUG');
  }
  error (namespace, msg, obj) {
    this.log(namespace, msg, obj, 'ERROR');
  }
}

module.exports = new Logger(process.env.DEACTIVATE_LOGGER);
