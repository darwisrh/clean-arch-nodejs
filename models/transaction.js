'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaction extends Model {
    
    static associate(models) {
      transaction.belongsTo(models.user, {
        as: 'user',
        foreignKey: {
          name: 'userId'
        }
      })

      transaction.belongsToMany(models.book, {
        as: 'books',
        through: {
          model: 'carts',
          as: 'bridge'
        },
        foreignKey: 'transactionId'
      })
    }
  }
  transaction.init({
    status: DataTypes.STRING,
    total: DataTypes.INTEGER,
    attachment: DataTypes.STRING,
    userId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'transaction',
  });
  return transaction;
};