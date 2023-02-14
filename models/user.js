'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    
    static associate(models) {
      user.hasMany(models.chat, {
        as: 'senderMessage',
        foreignKey: {
          name: 'senderId'
        }
      })

      user.hasMany(models.chat, {
        as: 'receiverMessage',
        foreignKey: {
          name: 'receiverId'
        }
      })

      user.hasMany(models.transaction, {
        as: 'transactions',
        foreignKey: {
          name: 'userId'
        }
      })
    }
  }
  user.init({
    fullName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    confirmPassword: DataTypes.STRING,
    gender: DataTypes.STRING,
    phone: DataTypes.STRING,
    avatar: DataTypes.STRING,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};