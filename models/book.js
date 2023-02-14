'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class book extends Model {
    
    static associate(models) {
      book.belongsToMany(models.transaction, {
        as: 'transactions',
        through: {
          model: 'carts',
          as: 'bridge'
        },
        foreignKey: 'bookId'
      })
    }
  }
  book.init({
    title: DataTypes.STRING,
    publicationDate: DataTypes.DATE,
    pages: DataTypes.INTEGER,
    isbn: DataTypes.STRING,
    writer: DataTypes.STRING,
    price: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    bookAttachment: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'book',
  });
  return book;
};