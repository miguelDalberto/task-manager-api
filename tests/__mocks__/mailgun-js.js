const mailgun = (info = {apiKey, domain}) => {
  return {
    messages() {
      return {
        send(data = {}, callback = function(error, body) {}) {
          callback(null, null)
        }
      }
    }
  }
}

module.exports = mailgun;