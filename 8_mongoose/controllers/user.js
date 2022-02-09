const mongoose = require('mongoose');

const UserModel = require('../models/user');
const ArticleModel = require('../models/article');
const errorHelper = require('../config/errorHelper');

const {findOwner} = require('./user_article_queries');

const findUserMiddleware = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const user = await findOwner(userId);
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  const {firstName, lastName, role, nickname} = req.body;

  try {
    const nickNameCount = await UserModel.count({nickname});

    if (nickNameCount) {
      return next(errorHelper.badRequest(`nickname:${nickname} already exists`));
    }

    const user = new UserModel({
      _id: new mongoose.Types.ObjectId(),
      firstName,
      lastName,
      role,
      nickname
    });

    const createdUser = await user.save();

    res.status(201).json({
      message: 'User created successfully',
      createdUser
    });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  const userId = req.params.userId.trim();

  try {
    const userDoc = await UserModel.findById(userId)
      .populate({
        path: 'articles',
        select: '_id title subtitle description category createdAt updatedAt owner'
      })
      .exec();

    res.status(200).json({
      user: userDoc,
      request: {
        type: 'GET'
      }
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = req.user;
    const userId = user._id;

    const {firstName, lastName, nickname, role} = req.body;

    const nicknameCount = await UserModel.count({
      $and: [{_id: {$ne: userId}}, {nickname: {$eq: nickname}}]
    });
    if (nicknameCount) {
      return next(errorHelper.badRequest(`nickname:${nickname} already taken`));
    }

    const updatedUser = await UserModel.findOneAndUpdate(
      {_id: user._id},
      {
        firstName,
        lastName,
        nickname,
        role
      },
      {runValidators: true, new: true}
    );

    res.status(200).json({
      message: `user with id ${userId} was updated successfully`,
      user: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = req.user;
    const userId = user._id;

    const deleteArticlesResult = await ArticleModel.deleteMany({owner: userId});

    const deleteResult = await UserModel.deleteOne({_id: userId});

    res.status(200).json({
      message: 'user was deleted',
      userDeleteResult: deleteResult,
      articleDeleteResult: deleteArticlesResult
    });
  } catch (error) {
    next(error);
  }
};

const getArticlesByUserId = async (req, res, next) => {
  try {
    const user = req.user;
    const userId = user._id;

    const articleDocs = await ArticleModel.where('owner').equals(userId).exec();

    res.status(200).json({
      count: articleDocs.length,

      articles: articleDocs.map(doc => ({
        id: doc._id,
        title: doc.title,
        subtitle: doc.subtitle,
        description: doc.description,
        category: doc.category,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
        updatedAt: doc.updatedAt,
        owner: doc.owner
      })),

      request: {
        type: 'GET'
      }
    });
  } catch (error) {}
};

module.exports = {
  findUserMiddleware,
  createUser,
  updateUser,
  getUserById,
  deleteUser,
  getArticlesByUserId
};
