const { user } = require('../../models')
const Joi = require('joi')
const jwt = require('jsonwebtoken')
const { encrypt, compare } = require('../middleware/bcrypt')

const register = async (req, res) => {
  const scheme = Joi.object({
    fullName: Joi.string().min(3).required(),
    email: Joi.string().email().min(6).required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().required(),
    gender: Joi.string().required()
  })

  const { error } = scheme.validate(req.body)

  if (error)
    return res.status(400).send({
      error: {
        message: error.details[0].message,
      },
    })

  try {
    // Check email if exist
    const oldUser = await user.findOne({
      where: {
        email: req.body.email
      }
    })

    if (oldUser?.email === req.body.email) {
      res.send({
        status: 'error',
        message: 'Email is already registered'
      })
      return
    }

    const hashedPassword = encrypt(req.body.password)
    const checkPass = compare(req.body.confirmPassword, hashedPassword)

    if (!checkPass) {
      res.status(400).send({
          status: 'failed',
          message: 'Confirm password must be same as password'
        })
      return
    }

    const newUser = await user.create({
      fullName: req.body.fullName,
      email: req.body.email,
      password: hashedPassword,
      confirmPassword: hashedPassword,
      gender: req.body.gender,
      role: 'user'
    })

    res.status(200).send({
      status: 'success',
      data: {
        newUser
      }
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: 'failed',
      message: 'Server Error',
    })
  }
}

const login = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().min(6).required(),
    password: Joi.string().min(6).required(),
  })

  const { error } = schema.validate(req.body)

  if (error)
    return res.status(400).send({
      error: {
        message: error.details[0].message,
      },
    })

  try {
    const userExist = await user.findOne({
      where: {
        email: req.body.email,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    })

    if (!userExist) {
      res.status(400).send({
        message: 'User unregister, you need to register first'
      })
      return
    }

    const getPassword = compare(req.body.password, userExist.password)
    if (!getPassword) {
      return res.status(400).send({
        status: 'failed',
        message: 'Password is incorrect',
      })
    }

    // generate token
    const token = jwt.sign({ id: userExist.id, fullName: userExist.fullName }, process.env.SECRET_KEY)

    res.status(200).send({
      status: 'success',
      data: {
        userExist,
        token
      }
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: 'failed',
      message: 'Server Error',
    });
  }
}

module.exports = {
  register,
  login
}