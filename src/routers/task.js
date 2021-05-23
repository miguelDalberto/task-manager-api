const { Router } = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new Router()

router.post('/tasks', auth, async ({ body, user }, res) => {
  const task = new Task({ 
    ...body,
    owner: user._id 
  })

  try {
    await task.save()
    res.status(201).send(task)
  } catch (err) {
    console.log(err)
    res.status(400).send(err)
  }
})

router.get('/tasks', auth, async ({ user, query }, res) => {
  const match = {}
  const { skip, limit, completed } = query
  if(completed) {
    match.completed = completed === 'true'
  }
  
  try {
    await user.populate({
      path: 'tasks',
      match,
      options: {
        limit: parseInt(limit),
        skip: parseInt(skip)
      }
    }).execPopulate() 
    res.send(user.tasks)
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
})

router.get('/tasks/:id', auth, async ({ user, params }, res) => {
  const _id = params.id
  try {
    const task = await Task.findOne({ _id, owner: user._id })
    task ?
      res.send(task)
    :
      res.status(404).send()
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
})

router.patch('/tasks/:id', auth, async ({ params, body, user }, res) => {
  const updates = Object.keys(body)
  const allowedOperations = ['description', 'completed']
  const isValidOperation = updates.every((update) => allowedOperations.includes(update))
  if(!isValidOperation)return res.status(400).send({ error: 'Invalid updates.' })

  try {
    const task = await Task.findOne({ _id: params.id, owner: user._id })

    if(!task)return res.status(404).send()

    updates.forEach(update => task[update] = body[update])
    await task.save()
    res.send(task)
  } catch (err) {
    console.log(err)
    res.status(400).send()
  }
})

router.delete('/tasks/:id', auth, async ({params, user}, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: params.id, owner: user._id})

    task ?
      res.send(task)
    :
      res.status(404).send()
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
})

module.exports = router
