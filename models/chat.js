'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class chat extends Model {
    
    static associate(models) {
      chat.belongsTo(models.user, {
        as: 'sender',
        foreignKey: {
          name: 'senderId'
        }
      })

      chat.belongsTo(models.user, {
        as: 'receiver',
        foreignKey: {
          name: 'receiverId'
        }
      })
    }
  }
  chat.init({
    message: DataTypes.TEXT,
    senderId: DataTypes.INTEGER,
    receiverId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'chat',
  });
  return chat;
}
//