require('dotenv').config()
const express = require('express')
const cors = require('cors')

const http = require('http')
const { Server } = require('socket.io')

const route = require('./app/routes')
const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL
  }
})

require('./app/socket')(io)

const port = 9000

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }))

app.use('/api/v1', route)
app.use('/uploads', express.static('uploads'))

app.get('/', (_, res) => {
  res.send({
    message: 'Wassus yall'
  })
})

server.listen(port, () => console.log(`Server run on port : ${port}`))