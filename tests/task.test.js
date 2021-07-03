const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const { userAId, userA, userB, taskA, setupDB, closeDBConnection } = require('./fixtures/db')

beforeEach(setupDB)
afterAll(closeDBConnection)

test('Should create task for user', async () => {
  const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userA.tokens[0].token}`)
    .send({ description: 'test description' })
    .expect(201)
  const task = await Task.findById(response.body._id)
  expect(task).not.toBeNull()
  expect(task.completed).toEqual(false)
})

test('Should fetch user tasks', async () => {
  const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${userA.tokens[0].token}`)
    .expect(200)
  
  expect(response.body.length).toBe(3)
})

test('Should not delete other user\'s task', async () => {
  await request(app)
    .delete(`/tasks/${taskA._id}`)
    .set('Authorization', `Bearer ${userB.tokens[0].token}`)
    .expect(404)
  
  const task = await Task.findById(taskA._id)
  expect(task).not.toBeNull()
})