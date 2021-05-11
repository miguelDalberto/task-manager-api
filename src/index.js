const express = require('express')
require('./db/mongoose')
// import routers
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT = 3000

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => console.log('server is on:', port))

