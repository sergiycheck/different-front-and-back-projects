const express = require('express');
const router = express.Router();

const userRoutes = require('./user.route');
const articleRoutes = require('./article.route');
const {defaultName, usersName, articlesName} = require('../apiRoutes');

router.use(`/${defaultName}`, (req, res, next) => {
  res.json({
    message: 'working api'
  });
});

router.use(`/${usersName}`, userRoutes);

router.use(`/${articlesName}`, articleRoutes);

module.exports = router;
