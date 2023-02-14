const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
	const authHeader = req.header('Authorization')
	const token = authHeader && authHeader.split(' ')[1]

	if (!token) {
		return res.status(401).send({
			status: 'failed',
			message: 'Unauthorized'
		})
	}

	try {
		const verified = jwt.verify(token, process.env.SECRET_KEY)
		res.user = verified
		next()
	} catch (err) {
		res.status(400).send({
			status: 'failed',
			message: 'invalid token'
		})
	}
}

module.exports = {
	auth
}