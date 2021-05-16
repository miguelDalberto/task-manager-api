const { Router } = require('express')
const { isValidObjectId } = require('mongoose')
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

router.patch('/users/:id', async ({ params, body }, res) => {
  const { id } = params
  if(!isValidObjectId(id))return res.status(400).send('Invalid ID.')
  
  const updates = Object.keys(body)
  const allowedOperations = ['name', 'email', 'password', 'age']
  const isValidOperation = updates.every((update) => allowedOperations.includes(update))
  if(!isValidOperation)return res.status(400).send({ error: 'Invalid updates.' })

  try {
    const user = await User.findById(id)
    updates.forEach((update) => user[update] = body[update])

    await user.save()
    user ?
      res.send(user)
    :
      res.status(404).send()
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

module.exports = router
