const { cart, book, transaction } = require('../../models')

const createCart = async (req, res) => {
	try {

		const newCart = await cart.create({
			include: [
				{
					model: book,
					as: 'bridge'
				},
				{
					model: transaction,
					as: 'bridge'
				}
			]
		})

		res.send({
			status: 'success',
			data: {
				newCart
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

const deleteCart = async (req, res) => {
	try {

		const { id } = req.params

		await cart.delete({
			where: {
				userId: id
			}
		})

		res.send({
			status: 'success',
			message: `Cart deleted`
		})

	} catch (err) {
		console.log(err)
		res.status(500).send({
			status: 'error',
			message: 'server error'
		})
	}
}

const getCart = async (req, res) => {
	try {

		const newCart = await cart.findAll({
			include: [
				{
					model: book,
					as: 'bridge'
				},
				{
					model: transaction,
					as: 'bridge'
				}
			]
		})

		if (!newCart) {
			res.send({
				message: 'cart not found'
			})
			return
		}

		res.send({
			status: 'succes',
			data: {
				newCart
			}
		})

	} catch (err) {
		console.log(err)
		res.send({
			status: 'error',
			message: 'server error'
		})
	}
}

module.exports = {
	createCart,
	deleteCart,
	getCart
}