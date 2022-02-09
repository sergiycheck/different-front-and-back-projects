const mongoose = require('mongoose');
const ArticleModel = require('../models/article');
const UserModel = require('../models/user');
const {findArticleAndOwner, findOwner, createQuery} = require('./user_article_queries');

const getArticleList = async (req, res, next) => {
  const requestQuery = req.query;

  try {
    let articleDocs;

    if (!requestQuery) {
      articleDocs = await ArticleModel.find().populate('owner').exec();
    } else {
      const query = createQuery(requestQuery);

      articleDocs = await ArticleModel.find(query).populate('owner').exec();
    }

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
        owner: doc.owner
      })),
      request: {
        type: 'GET'
      }
    });
  } catch (error) {
    next(error);
  }
};

const createArticle = async (req, res, next) => {
  const {owner} = req.body;

  try {
    const ownerFromDb = await findOwner(owner);

    const {title, subtitle, description, category} = req.body;

    const article = new ArticleModel({
      _id: new mongoose.Types.ObjectId(),
      title,
      subtitle,
      description,
      category,
      owner
    });

    const createdArticle = await article.save();

    await UserModel.findOneAndUpdate(
      {_id: owner},
      {
        $set: {numberOfArticles: ++ownerFromDb.numberOfArticles},
        $push: {articles: createdArticle._id}
      },
      {new: true}
    );

    res.status(201).json({
      message: 'Article was created!',
      createdArticle,
      request: {
        type: 'GET',
        url: `/api/articles/${createdArticle._id}`
      }
    });
  } catch (error) {
    next(error);
  }
};

const deleteArticle = async (req, res, next) => {
  const articleId = req.params.articleId.trim();
  const ownerId = req.body.owner;

  try {
    const {article, owner} = await findArticleAndOwner(articleId, ownerId);

    await UserModel.findOneAndUpdate(
      {_id: article.owner},
      {
        $set: {numberOfArticles: --owner.numberOfArticles},
        $pull: {articles: article._id}
      },
      {new: true}
    );

    const deleteResult = await ArticleModel.deleteOne({_id: articleId});

    res.status(200).json({
      message: 'article was deleted',
      deleteResult
    });
  } catch (error) {
    next(error);
  }
};

const updateArticle = async (req, res, next) => {
  const articleId = req.params.articleId.trim();
  const ownerId = req.body.owner;

  try {
    const {article} = await findArticleAndOwner(articleId, ownerId);

    const updateResult = await ArticleModel.updateOne(
      {_id: article._id},
      {
        title: req.body.title,
        subtitle: req.body.subtitle,
        description: req.body.description,
        category: req.body.category,
        updatedAt: Date.now()
      },
      {runValidators: true}
    );

    res.status(200).json({
      message: `article with id ${articleId} was updated successfully`,
      updateCount: updateResult.modifiedCount
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {createArticle, getArticleList, deleteArticle, updateArticle};
