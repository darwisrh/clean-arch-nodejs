const { user, chat, transaction } = require('../../models')
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')

const connectedUser = {}
const socketIo = (io) => {
  
  io.use((socket, next) => {
    if (socket.handshake.auth && socket.handshake.auth.token) {
      next()
    } else {
      next(new Error(`Unauthorized`))
    }
  })

  io.on('connection', async (socket) => {
    console.log('client connect:', socket.id)

    const userId = socket.handshake.query.id

    connectedUser[userId] = socket.id

    socket.on('load admin', async () => {
      try {
        const adminContact = await user.findOne({
          where: {
            role: 'admin'
          }
        })

        socket.emit('admin contact', adminContact)
      } catch (err) {
        console.log(err)
      }
    })

    socket.on('load customer contact', async () => {
      try {
        const customerContact = await user.findAll({
          include: [
            {
              model: transaction,
              as: 'transactions'
            },
            {
              model: chat,
              as: 'senderMessage'
            },
            {
              model: chat,
              as: 'receiverMessage'
            }
          ]
        })

        customerContact = JSON.parse(JSON.stringify(customerContact))
        customerContact = customerContact.map(item => ({
          ...item,
          transaction: {
            ...item.transaction,
            attachment: item.transaction?.attachment
              ? process.env.PATH_FILE + item.transaction?.attachment
              : null
          }
        }))

        socket.emit('customer contact', customerContact)
      } catch (err) {
        console.log(err)
      }
    })

    socket.on('load message', async (payload) => {
      console.log(payload)
      try {
        const token = socket.handshake.auth.token
        const secretKey = process.env.SECRET_KEY

        const verify = jwt.verify(token, secretKey)

        const receiverId = payload
        const senderId = verify.id

        const dataChats = await chat.findAll({
          where: {
            senderId: {
              [Op.or]: [receiverId, senderId]
            },
            receiverId: {
              [Op.or]: [receiverId, senderId]
            }
          },
          include: [
            {
              model: user,
              as: 'receiver',
              attributes: {
                exclude: ['createdAt', 'updatedAt', 'password'],
              }
            },
            {
              model: user,
              as: 'sender',
              attributes: {
                exclude: ['createdAt', 'updatedAt', 'password'],
              }
            }
          ],
          order: [['createdAt', 'ASC']],
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'receiverId', 'senderId']
          }
        })

        socket.emit('message', dataChats)
      } catch (err) {
        console.log(err)
      }
    })

    socket.on('send message', async (payload) => {
      try {
        const token = socket.handshake.auth.token
        const secretKey = process.env.SECRET_KEY

        const verify = jwt.verify(token, secretKey)

        const senderId = verify.id
        const { message, receiverId } = payload

        await chat.create({
          message,
          receiverId,
          senderId
        })

        io.to(socket.id)
          .to(connectedUser[receiverId])
          .emit('new message', receiverId)
      } catch (err) {
        console.log(err)
      }
    })

    socket.on('disconnect', () => {
      console.log('client disconnected', socket.id)
      delete connectedUser[userId]
    })
  })
}

module.exports = socketIo