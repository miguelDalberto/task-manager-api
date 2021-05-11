const { Router } = require('express')
const Task = require('../models/task.js')
const router = new Router()

router.post('/tasks', async ({ body }, res) => {
  const task = new Task(body)

  try {
    await task.save()
    res.status(201).send(task)
  } catch (err) {
    console.log(err)
    res.status(400).send(err)
  }
})

router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({})
    res.send(tasks)
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
})

router.get('/tasks/:id', async ({ params }, res) => {
  const { id } = params
  if(id.length < 12)return res.status(400).send('Invalid ID.')

  try {
    const task = await Task.findById(id)
    task ?
      res.send(task)
    :
      res.status(404).send()
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
})

router.patch('/tasks/:id', async ({ params, body }, res) => {
  const { id } = params
  if(id.length < 12)return res.status(400).send('Invalid ID.')

  const updates = Object.keys(body)
  const allowedOperations = ['description', 'completed']
  const isValidOperation = updates.every((update) => allowedOperations.includes(update))
  if(!isValidOperation)return res.status(400).send({ error: 'Invalid updates.' })

  try {
    const task = await Task.findByIdAndUpdate(id, body, { new: true, runValidators: true })

    task ?
      res.send(task)
    :
      res.status(404).send()
  } catch (err) {
    console.log(err)
    res.status(400).send()
  }
})

router.delete('/tasks/:id', async ({params}, res) => {
  const { id } = params
  if(id.length < 12)return res.status(400).send('Invalid ID.')

  try {
    const task = await Task.findByIdAndDelete(id)

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
