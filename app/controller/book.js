const { book } = require('../../models')

const createBook = async (req, res) => {
	try {

		const bookData = req.body
		const bookAttachment = req.file?.filename

		const allBookData = {
			...bookData,
			bookAttachment: bookAttachment ? process.env.PATH_FILE + bookAttachment : null
		}

		const newBook = await book.create(allBookData)

		res.send({
			status: 'success',
			data: {
				newBook
			}
		})

	} catch (err) {
		console.log(err)
		res.status(500).send({
			status: 'error',
			message: 'server error'
		})
	}
}

const getAllBooks = async (req, res) => {
	try {

		const allBooks = await book.findAll()

		res.send({
			status: 'success',
			data: {
				allBooks
			}
		})

	} catch (err) {
		console.log(err)
		res.status(500).send({
			status: 'error',
			message: 'server error'
		})
	}
}

const getBookById = async (req, res) => {
	try {

		const { id } = req.params

		const bookById = await book.findOne({
			where: {
				id
			}
		})

		if (!bookById) {
			res.send({
				message: 'Book not found'
			})
			return 
		}

		res.send({
			status: 'success',
			data: {
				bookById
			}
		})

	} catch (err) {
		console.log(err)
		res.status(500).send({
			status: 'error',
			message: 'server error'
		})
	}
}

const deleteBookById = async (req, res) => {
	try {

		const { id } = req.params

		const bookById = await book.destroy({
			where: {
				id
			}
		})

		if (!bookById) {
			res.send({
				message: 'Book not find'
			})
			return
		}

		res.send({
			status: 'success',
			message: `Book with id = ${id} deleted`
		})

	} catch (err) {
		console.log(err)
		res.status(500).send({
			status: 'error',
			message: 'server error'
		})
	}
}

const deleteAllBook = async (req, res) => {
	try {

		const bookById = await book.destroy({ where: {} })

		res.send({
			status: 'success',
			message: 'All book deleted'
		})
	} catch (err) {
		console.log(err)
		res.status(500).send({
			status: 'error',
			message: 'server error'
		})
	}
}

const updateBook = async (req, res) => {
	try {
		const { id } = req.params
		const newBook = req.body
		const bookAttachment = req.file?.filename

		const newData = {
			...newBook,
			bookAttachment: bookAttachment ? process.env.PATH_FILE + bookAttachment : null
		}

		await book.update(newData, {
			where: {
				id
			}
		})
//
		const newBookUpdate = await book.findOne({
			where: {
				id
			}
		})

		res.send({
			status: 'success',
			data: {
				newBookUpdate
			}
		})
	} catch (err) {
		console.log(err)
		res.status(500).send({
			status: 'error',
			message: 'server error'
		})
	}
}

module.exports = {
	createBook,
	getAllBooks,
	getBookById,
	deleteBookById,
	deleteAllBook,
	updateBook
}