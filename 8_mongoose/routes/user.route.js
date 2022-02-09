const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');
const {findUserMiddleware} = require('../controllers/user');

router.post('/', userController.createUser);
router.put('/:userId', findUserMiddleware, userController.updateUser);
router.get('/:userId', userController.getUserById);
router.delete('/:userId', findUserMiddleware, userController.deleteUser);
router.get('/:userId/articles', findUserMiddleware, userController.getArticlesByUserId);

module.exports = router;
