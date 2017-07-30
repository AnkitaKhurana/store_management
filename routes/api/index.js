const router = require('express').Router;

const route = router();

route.use('/footwear', require('./footwear'));
route.use('/users', require('./users'));


module.exports = route;