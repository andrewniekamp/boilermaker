const router = require('express').Router();
const { User, Product } = require('../db/');

router.use(require('./users'));

module.exports = router;
