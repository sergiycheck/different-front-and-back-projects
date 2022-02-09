const express = require('express');
const router = express.Router();

const userRoutes = require('./user.route');
const articleRoutes = require('./article.route');

router.use('/default', (req, res, next) => {
  res.json({
    message: 'working api'
  });
});

router.use('/users', userRoutes);

router.use('/articles', articleRoutes);

module.exports = router;
