const _ = require('lodash');

const ArticleModel = require('../models/article');
const UserModel = require('../models/user');
const errorHelper = require('../config/errorHelper');

async function findArticleAndOwner(articleId, ownerId) {
  const article = await findArticle(articleId);

  if (article.owner.valueOf() !== ownerId) {
    throw errorHelper.forbidden(
      `user with id ${ownerId} can not delete article with id ${articleId}`
    );
  }

  const owner = await findOwner(article.owner);

  return {article, owner};
}

async function findArticle(articleId) {
  const article = await ArticleModel.findById(articleId).exec();
  if (!article) {
    throw errorHelper.notFound(`article with id ${articleId} does not exist`);
  }
  return article;
}

async function findOwner(ownerId) {
  const owner = await UserModel.findById(ownerId).exec();
  if (!owner) {
    throw errorHelper.notFound(`user with id ${ownerId} does not exist`);
  }
  return owner;
}

function createQuery(requestQuery) {
  const filters = [
    'title',
    'subtitle',
    'description',
    'owner',
    'category',
    'createdAt',
    'updatedAt'
  ];

  const [title, subtitle, description, owner, category, createdAt, updatedAt] = filters;

  const allFilters = _.pick(requestQuery, filters);

  let query = {};

  for (let prop in allFilters) {
    if (prop === title) {
      query['$text'] = {$search: allFilters[prop]};
      continue;
    }

    if (prop === createdAt || prop === updatedAt) {
      const date = new Date(allFilters[prop]).toISOString();
      query[prop] = {$gte: date};
      continue;
    }

    query[prop] = {$eq: allFilters[prop]};
  }

  return query;
}

function mapOnlyUser(userFromDb) {
  const {_id, firstName, lastName, nickname, role, createdAt, numberOfArticles, articles} =
    userFromDb;
  return {
    id: _id,
    firstName,
    lastName,
    nickname,
    role,
    createdAt,
    numberOfArticles,
    articles
  };
}

function mapOnlyArticle(articleFromDb) {
  const {_id, title, subtitle, description, category, createdAt, updatedAt, owner} = articleFromDb;

  return {
    id: _id,
    title,
    subtitle,
    description,
    category,
    createdAt,
    updatedAt,
    owner
  };
}

function mapArticleWithOwner(articleFromDb) {
  const {_id, title, subtitle, description, category, createdAt, updatedAt, owner} = articleFromDb;

  return {
    id: _id,
    title,
    subtitle,
    description,
    category,
    createdAt,
    updatedAt,
    owner: mapOnlyUser(owner)
  };
}

function mapUserWithArticles(userFromDb) {
  const {_id, firstName, lastName, nickname, role, createdAt, numberOfArticles, articles} =
    userFromDb;

  return {
    id: _id,
    firstName,
    lastName,
    nickname,
    role,
    createdAt,
    numberOfArticles,
    articles: articles.map(article => mapOnlyArticle(article))
  };
}

module.exports = {
  findArticleAndOwner,
  findArticle,
  findOwner,
  createQuery,
  mapOnlyUser,
  mapOnlyArticle,
  mapArticleWithOwner,
  mapUserWithArticles
};
