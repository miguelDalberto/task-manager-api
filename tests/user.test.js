const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { userAId, userA, userBId, userB, setupDB, closeDBConnection } = require('./fixtures/db')

beforeEach(setupDB)
afterAll(closeDBConnection)

test('Should signup a new user', async () => {
  const { body } = await request(app)
    .post('/users')
    .send({
      name: 'Zacaria',
      email: 'zacaria@email.com',
      password: 'minhasenha'
    })
    .expect(201)

  // assert that the database was changed correctly
  const user = await User.findById(body.user._id)
  expect(user).not.toBeNull()

  // assertions about the response
  expect(body).toMatchObject({
    user: {
      name: 'Zacaria',
      email: 'zacaria@email.com', 
    },
    token: user.tokens[0].token
  })

  // assert that the password wasn't save in plain text
  expect(user.password).not.toBe('minhasenha')
})

test('Should login existing user', async () => {
  const { body } = await request(app).post('/users/login')
    .send({
      email: userA.email,
      password: userA.password
    })
    .expect(200)

    const user = await User.findById(body.user._id)

    expect(body.token).toBe(user.tokens[1].token)
})

test('Should not login nonexisting user', async () => {
  await request(app)
    .post('/users/login')
    .send({
      email: "random@a.a",
      password:'randompass' 
    })
    .expect(400)
})

test('Should get profile for user', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userA.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
  await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

test('Should delete account for user', async () => {
  await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userA.tokens[0].token}`)
    .send()
    .expect(200)

  // assert that user was deleted
  const user = await User.findById(userAId)
  expect(user).toBeNull()
})

test('Should not delete account for unauthenticated user', async () => {
  await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
})

test('Should upload avatar image', async () => {
  await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userA.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/profile.jpeg')
    .expect(200)
  const user = await User.findById(userAId)
  expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
  const newName = 'Noé'

  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userA.tokens[0].token}`)
    .send({ name: newName })
    .expect(200)

    const user = await User.findById(userAId)
    expect(user.name).toBe(newName)
})

test('Should not update invalid user fields', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userA.tokens[0].token}`)
    .send({ location: 'Caxias do Sul' })
    .expect(401)

  const user = await User.findById(userAId)
  expect(user.location).toBeUndefined()
})
