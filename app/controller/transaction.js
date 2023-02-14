const { transaction, cart } = require('../../models')

const createTransaction = async (req, res) => {
	try {

		const dataTrans = req.body
		const attachment = req.file?.filename

		const dataTransaction = {
			...dataTrans,
			attachment: attachment ? process.env.PATH_FILE + attachment : null
		}

		const newTransaction = await transaction.create(dataTransaction)

		res.send({
			status: 'success',
			data: {
				newTransaction
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

const getAllTransactions = async (req, res) => {
	try {

		const allTransaction = await transaction.findAll()

		if (!allTransaction) {
			res.send({
				status: 'error',
				message: 'Transaction not found'
			})
			return
		}

		res.send({
			status: 'success',
			data: {
				allTransaction
			}
		})
	} catch (err) {
		console.log(err)
		res.status(500).send({
			status: 'failed',
			message: 'server error'
		})
	}
}

const getTransactionByUserId = async (req, res) => {
	try {

		const { id } = req.params

		const getTransaction = await transaction.findAll({
			where: {
				userId: id
			}
		})

		res.send({
			status: 'success',
			data: {
				getTransaction
			}
		})

	} catch (err) {
		console.log(err)
		res.status(500).send({
			status: 'failed',
			message: 'server error'
		})
	}
}

const deleteTransaction = async (req, res) => {
	try {

		const { id } = req.params

		await transaction.destroy({
			where: {
				id
			}
		})

		res.send({
			status: 'success',
			message: `Transaction with id = ${id} deleted`
		})

	} catch (err) {
		console.log(err)
		res.status(500).send({
			status: 'failed',
			message: 'server error'
		})
	}
}
const deleteTransByUserId = async (req, res) => {
	try {

		const { id } = req.params

		await transaction.destroy({
			where: {
				userId: id
			}
		})

		res.send({
			status: 'success',
			message: `All transaction deleted`
		})

	} catch (err) {
		console.log(err)
		res.status(500).send({
			status: 'failed',
			message: 'server error'
		})
	}
}

module.exports = {
	createTransaction,
	getAllTransactions,
	getTransactionByUserId,
	deleteTransaction,
	deleteTransByUserId
}