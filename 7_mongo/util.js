const faker = require('faker');

const generateUser = ({
  firstName = faker.name.firstName(),
  lastName = faker.name.lastName(),
  department,
  createdAt = new Date().toISOString()
} = {}) => ({
  firstName,
  lastName,
  department,
  createdAt
});

const generateArticle = ({
  name = faker.name.title(),
  description = faker.random.words(4),
  type,
  tags = []
} = {}) => ({
  name,
  description,
  type,
  tags
});

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
};

module.exports = {
  mapUser: generateUser,
  mapArticle: generateArticle,
  getRandomInt
};
