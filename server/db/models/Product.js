const Sequelize = require('sequelize');
const db = require('../db');

const Product = db.define('product', {
  name: Sequelize.STRING
})

module.exports = Product;
