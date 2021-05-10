const { Router } = require('express')
const User = require('../models/user.js')
const router = new Router()

router.post('/users', async ({ body }, res) => {
  const user = new User(body)

  try {
    await user.save()
    res.status(201).send(user)
  } catch (err) {
    console.log(err)
    res.status(400).send(err)
  }
})

router.get('/users', async (req, res) => {

  try {
    const users = await User.find({})
    res.status(200).send(users)
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
})

router.get('/users/:id', async ({ params }, res) => {
  const _id = params.id
  if(_id.length < 12)return res.status(400).send('Invalid ID.')

  try {
    const user = await User.findById(_id)
    
    user ?
      res.send(user)
    :
      res.status(404).send()
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
})

router.patch('/users/:id', async ({ params, body }, res) => {
  const { id } = params
  if(id.length < 12)return res.status(400).send('Invalid ID.')

  try {
    const user = await User.findByIdAndUpdate(_id, body, { new: true, runValidators: true })

    user ?
      res.send(user)
    :
      res.status(404).send()
  } catch (err) {
    console.log(err)
    res.status(400).send()
  }
})

router.delete('/users/:id', async ({ params }, res) => {
  const { id } = params
  if(id.length < 12)return res.status(400).send('Invalid ID.')

  try {
    const user = await User.findByIdAndDelete(id)

    user ?
      res.send(user)
    :
      res.status(404).send()
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
})

module.exports = router
