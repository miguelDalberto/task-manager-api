const { Router } = require('express')
const { isValidObjectId, Error } = require('mongoose')
const multer = require('multer')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new Router()

router.post('/users', async ({ body }, res) => {
  const user = new User(body)

  try {
    await user.save()

    const token = await user.generateAuthToken()
    res.status(201).send({ user, token })
  } catch (err) {
    res.status(400).send(err)
  }
})

router.post('/users/login', async ({ body }, res) => {
  const { email, password } = body

  try {
    const user = await User.findByCredentials(email, password)
    const token = await user.generateAuthToken()
    res.send({ user, token })
  } catch (err) {
    res.status(400).send()
  }
})

router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token)
    await req.user.save()
    res.send()
  } catch (err) {
    res.status(500).send()
  }
})

router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = []
    await req.user.save()
    res.send()
  } catch (err) {
    res.status(500).send()
  }
})

router.get('/users/me', auth, async (req, res) => res.send(req.user))

router.patch('/users/me', auth, async ({ body, user }, res) => {
  const updates = Object.keys(body)
  const allowedOperations = ['name', 'email', 'password', 'age']
  const isValidOperation = updates.every((update) => allowedOperations.includes(update))
  if(!isValidOperation)return res.status(400).send({ error: 'Invalid updates.' })

  try {
    updates.forEach((update) => user[update] = body[update])

    await user.save()
    res.send(user)
  } catch (err) {
    console.log(err)
    res.status(400).send()
  }
})

router.delete('/users/me', auth, async (req, res) => {
  try {
    await req.user.remove()
    res.send(req.user)
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
})

const upload = multer({
  limits: { fileSize: 1000000 },
  fileFilter(req, file, cb) {
    if(!file.originalname.match(/\.(jpeg|png|jpg)$/)) {
      return cb(new Error('Invalid file type. Try jpeg, jpg or png.'))
    }
    return cb(null, true)
  }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async ({ file, user }, res) => {
  user.avatar = file.buffer
  await user.save()
  res.send()
}, (err, req, res, next) => {
  res.status(400).send({ error: err.message })
})

router.delete('/users/me/avatar', auth, async ({ user }, res) => {
  user.avatar = undefined
  await user.save()
  res.send()
})

router.get('/users/:id/avatar', async ({ params }, res) => {
  if(!isValidObjectId(params.id))return res.status(400).send({ error: 'Invalid ID.' })
  try {
    const user = await User.findById(params.id)

    if(!user || !user.avatar){
      throw new Error()
    }

    res.set('Content-Type', 'image/jpg')
    res.send(user.avatar)
  } catch (err) {
    res.status(404).send()
  }
})

module.exports = router
