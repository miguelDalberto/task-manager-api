const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

const userAId = new mongoose.Types.ObjectId()
const userA = { 
  _id: userAId,
  name: 'José',
  email: 'jose@email.com',
  password: 'minhasenha',
  tokens: [{
    token: jwt.sign({ _id: userAId }, process.env.JWT_SECRET)
  }]
}

const userBId = new mongoose.Types.ObjectId()
const userB = {  
  _id: userBId,
  name: 'Miguel',
  email: 'miguel@email.com',
  password: 'minhasenha',
  tokens: [{
    token: jwt.sign({ _id: userBId }, process.env.JWT_SECRET)
  }]
}

const taskA = {
  _id: new mongoose.Types.ObjectId(),
  description: 'test task 1',
  completed: false,
  owner: userA._id
}

const taskB = {
  _id: new mongoose.Types.ObjectId(),
  description: 'test task 2',
  completed: true,
  owner: userA._id
}

const taskC = {
  _id: new mongoose.Types.ObjectId(),
  description: 'test task 3',
  completed: false,
  owner: userA._id
}

const setupDB = async () => {
  await User.deleteMany()
  await Task.deleteMany()
  await new User(userA).save()
  await new User(userB).save()
  await new Task(taskA).save()
  await new Task(taskB).save()
  await new Task(taskC).save()
}

const closeDBConnection = async () => {
  await mongoose.connection.close()
}

module.exports = {
  userAId,
  userA,
  userBId,
  userB,
  taskA,
  setupDB,
  closeDBConnection
}