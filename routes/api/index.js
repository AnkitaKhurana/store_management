const router = require('express').Router;

const route = router();

route.use('/new', require('./new'));
route.use('/users', require('./users'));


module.exports = route;