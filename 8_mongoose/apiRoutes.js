const apiName = 'api';
const apiRouteValue = `/${apiName}`;

const defaultName = `default`;
const defaultRouteValue = `${apiRouteValue}/${defaultName}`;

const usersName = 'users';
const userRouteValue = `${apiRouteValue}/${usersName}`;

const articlesName = 'articles';
const articleRouteValue = `${apiRouteValue}/${articlesName}`;

module.exports = {
  apiRouteValue,
  defaultName,
  usersName,
  articlesName,

  defaultRouteValue,
  userRouteValue,
  articleRouteValue
};
