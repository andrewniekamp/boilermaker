const User = require('./models/User');
const Product = require('./models/Product');

Product.belongsTo(User, { as: 'user'});
User.hasMany(Product);

module.exports = {
  Product,
  User
};
