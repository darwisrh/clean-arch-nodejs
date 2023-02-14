const express = require('express')
const routes = express()

// Middleware
const { uploadFile } = require('../middleware/uploadFile')
const { auth } = require('../middleware/auth')

// Authenticate
const {
  register,
  login
} = require('../controller/auth')

// User Controller
const {
	getAllUser,
	getUserById,
	updateUser,
	deleteUser
} = require('../controller/user')

// Transaction Controller
const {
	createTransaction,
	getAllTransactions,
	getTransactionByUserId,
	deleteTransaction,
	deleteTransByUserId
} = require('../controller/transaction')

// Cart Controller
const {
	createCart,
	deleteCart,
	getCart
} = require('../controller/cart')

// Book Controller
const {
	createBook,
	getAllBooks,
	getBookById,
	deleteBookById,
	deleteAllBook,
	updateBook
} = require('../controller/book')

// Authenticate
routes.post('/register', register)
routes.post('/login', login)

// User Routes
routes.get('/users', getAllUser)
routes.get('/user/:id', getUserById)
routes.put('/user/:id', auth, uploadFile('avatar'), updateUser)
routes.delete('/user/:id', auth, deleteUser)

// Transaction Routes
routes.post('/transaction', auth, uploadFile('attachment'), createTransaction)
routes.get('/transactions', auth, getAllTransactions)
routes.get('/transaction/:id', auth, getTransactionByUserId)
routes.delete('/transaction/:id', auth, deleteTransaction)
routes.delete('/delete-all-transaction/:id', auth, deleteTransByUserId)

// Cart Routes
routes.post('/cart', auth, createCart)
routes.delete('/cart/:id', auth, deleteCart)
routes.get('/carts', auth, getCart)


// Book Routes
routes.post('/book', auth, uploadFile('bookAttachment'), createBook)
routes.get('/books', getAllBooks)
routes.get('/book/:id', getBookById)
routes.delete('/book/:id', auth, deleteBookById)
routes.delete('/delete-all-book', auth, deleteAllBook)
routes.put('/book/:id', auth, uploadFile('bookAttachment'), updateBook)

module.exports = routes