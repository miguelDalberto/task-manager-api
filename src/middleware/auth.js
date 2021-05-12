const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '')
    const { _id } = jwt.verify(token, 'helloComrade')
    const user = await User.findOne({ _id, 'tokens.token': token })

    if(!user){ throw new Error() }

    req.token = token
    req.user = user
    next()
  } catch (err) {
    res.status(401).send({ error: 'Authentication failed.' })
  }
}

module.exports = auth