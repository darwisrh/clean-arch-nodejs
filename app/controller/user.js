const { user, transaction, chat } = require('../../models')

const getAllUser = async (req, res) => {
	try {

		const users = await user.findAll({
			include: [
				{
					model: transaction,
					as: 'transactions',
				},
				{
					model: chat,
					as: 'sender'
				},
				{
					model: chat,
					as: 'receiver'
				}
			]
		})

		if (!users) {
			res.send({
				status: 'error',
				message: 'user not found'
			})
			return
		}

		res.send({
			status: 'success',
			data: {
				users
			}
		})

	} catch (err) {
		console.log(err)
		res.status(500).send({
			status: 'error',
			message: 'server error',
			error: err
		})
	}
}

const getUserById = async (req, res) => {
	try {

		const { id } = req.params

		const userById = await user.findOne({
			where: {
				id
			},
			include: [
				{
					model: transaction,
					as: 'transactions',
				},
				{
					model: chat,
					as: 'sender'
				},
				{
					model: chat,
					as: 'receiver'
				}
			]
		})

		if (!userById) {
			res.send({
				status: 'error',
				message: `user with id = ${id} not exist`
			})
			return
		}

		res.send({
			status: 'success',
			data: userById
		})

	} catch (err) {
		console.log(err)
		res.status(500).send({
			status: 'error',
			message: 'server error',
			error: err
		})
	}
}

const updateUser = async (req, res) => {
	try {

		const { id } = req.params
		const oldUser = req.body
		const avatar = req.file?.filename

		const newData = {
			...oldUser,
			avatar: avatar ? process.env.PATH_FILE + avatar : null
		}

		await user.update(newData, {
			where: {
				id
			}
		})

		const newuser = await user.findOne({
			where: {
				id
			}
		})

		res.send({
			status: 'success',
			data: newuser
		})

	} catch (err) {
		console.log(err)
		res.status(500).send({
			status: 'error',
			message: 'server error',
			error: err
		})
	}
}

const deleteUser = async (req, res) => {
	try {

		const { id } = req.params

		const deleteUser = await user.destroy({
			where: {
				id
			}
		})

		if (!deleteUser) {
			res.send({
				message: 'User not exist'
			})
			return
		}

		res.send({
			status: 'success',
			message: `user with id = ${id} deleted`
		})

	} catch (err) {
		console.log(err)
		res.status(500).send({
			status: 'error',
			message: 'server error',
			error: err
		})
	}
}

module.exports = {
	getAllUser,
	getUserById,
	updateUser,
	deleteUser
}