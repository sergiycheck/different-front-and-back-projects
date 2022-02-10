const mongoose = require('mongoose');
const request = require('supertest');
const _ = require('lodash');
const app = require('../app');
const {userRouteValue, articleRouteValue} = require('../apiRoutes');
const seedDb = require('./seedDb');

const connectionString =
  'mongodb://127.0.0.1:27017/tc-mongo-homework-testing?directConnection=true&serverSelectionTimeoutMS=2000';

describe('test api endpoints', () => {
  let server;

  beforeAll(() => {
    server = app;
  });

  beforeEach(done => {
    mongoose.connect(connectionString, () => done());
  });

  afterEach(done => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(() => {
        done();
      });
    });
  });

  test('testing if api return message', async () => {
    const response = await request(server).get('/api/default');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('working api');
  });

  test('creates user', async () => {
    const response = await request(server)
      .post(`${userRouteValue}/`)
      .send({
        firstName: 'Leanne',
        lastName: 'Graham',
        nickname: 'leane1Gra',
        role: 'guest'
      })
      .set('Accept', 'application/json');

    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.status).toBe(201);
    const data = response.body;
    const {createdUser} = data;

    expect(createdUser.firstName).toBe('Leanne');
    expect(createdUser.id).toBeTruthy();
  });

  test('seeds users and gets the list of users with populated articles', async () => {
    await seedDb(mongoose);

    await request(server)
      .get(userRouteValue)
      .expect(200)
      .then(response => {
        const data = response.body;

        expect(data.count).toBe(3);
        expect(Array.isArray(data.users));
        expect(Array.isArray(data.users[0].articles));
        expect(data.users[0].articles.length).toBe(2);
        expect(data.users[0].numberOfArticles).toBe(2);
      });
  });

  test('seeds articles and gets the list of articles with populated owner path', async () => {
    await seedDb(mongoose);

    await request(server)
      .get(articleRouteValue)
      .expect(200)
      .then(response => {
        const data = response.body;

        expect(data.count).toBe(5);
        expect(Array.isArray(data.articles));
        expect(data.articles[0].owner).toBeTruthy();
        expect(data.articles[0].title).toBeTruthy();
        expect(data.articles[0].id).toBeTruthy();
      });
  });

  test('seeds and updates article', async () => {
    const {articles} = await seedDb(mongoose);
    const articleToUpdate = articles[0];

    const updateObject = {
      title: `article changed title abc`,
      subtitle: 'subtitle great',
      description: 'article description 1',
      category: 'games',
      owner: articleToUpdate.owner
    };

    const response = await request(server)
      .put(`${articleRouteValue}/${articleToUpdate._id}`)
      .send(updateObject)
      .set('Accept', 'application/json');

    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.status).toBe(200);

    const data = response.body;
    const {updatedArticle} = data;

    expect(updatedArticle.id).toBe(articleToUpdate._id.valueOf());
    expect(updatedArticle.title).toBe(updateObject.title);
    expect(updatedArticle.category).toBe(updateObject.category);
  });

  test('seeds and updates user', async () => {
    const {authors} = await seedDb(mongoose);
    const authorToUpdate = authors[0];
    const userUpdateObj = {
      firstName: 'updatedUserFirstName',
      lastName: 'lasnameUpdated',
      nickname: 'leane1Gra',
      role: 'guest'
    };

    const response = await request(server)
      .put(`${userRouteValue}/${authorToUpdate._id}`)
      .send(userUpdateObj)
      .set('Accept', 'application/json');

    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.status).toBe(200);

    const data = response.body;
    const {user} = data;

    expect(user.id).toBe(authorToUpdate._id.valueOf());
    expect(user.firstName).toBe(userUpdateObj.firstName);
    expect(user.lastName).toBe(userUpdateObj.lastName);
    expect(user.nickname).toBe(userUpdateObj.nickname);
    expect(user.role).toBe(userUpdateObj.role);
  });

  test('can not update non existing user', async () => {
    const {authors} = await seedDb(mongoose);
    const authorToUpdate = authors[0];
    authorToUpdate._id = new mongoose.Types.ObjectId();

    const response = await request(server)
      .put(`${userRouteValue}/${authorToUpdate._id}`)
      .send({})
      .set('Accept', 'application/json');

    expect(response.status).toBe(404);

    const data = response.body;
    expect(data.message).toBe(`user with id ${authorToUpdate._id.valueOf()} does not exist`);
  });

  test('gets user by id ', async () => {
    const {authors} = await seedDb(mongoose);
    const userToFind = authors[0];

    const response = await request(server).get(`${userRouteValue}/${userToFind._id}`);

    expect(response.status).toBe(200);
    const data = response.body;
    const {user} = data;

    expect(user.id).toBeTruthy();
    expect(user.articles).toBeInstanceOf(Array);
    expect(user.articles.length).toBe(2);
    expect(user.numberOfArticles).toBe(2);
  });

  test('deletes user and all his articles', async () => {
    const {authors} = await seedDb(mongoose);
    const userToDelete = authors[0];

    const response = await request(server).delete(`${userRouteValue}/${userToDelete._id}`);

    expect(response.status).toBe(200);
    const data = response.body;
    expect(data.userDeleteResult.deletedCount).toBe(1);
    expect(data.articleDeleteResult.deletedCount).toBe(2);
  });

  test('gets all articles created by user', async () => {
    const {authors} = await seedDb(mongoose);
    const userToFind = authors[0];

    const response = await request(server).get(`${userRouteValue}/${userToFind._id}/articles`);

    expect(response.status).toBe(200);
    const data = response.body;
    expect(data.count).toBe(2);
    expect(data.articles).toBeInstanceOf(Array);
    expect(data.articles.length).toBe(2);

    for (let article of data.articles) {
      expect(article.owner).toBe(userToFind._id.valueOf());
    }
  });

  test('creates article', async () => {
    const {authors} = await seedDb(mongoose);
    const userToFind = authors[0];

    const articleToCreate = {
      title: 'new article title',
      subtitle: 'slug word',
      description: 'delightful description',
      category: 'history',
      owner: userToFind._id.valueOf()
    };

    const response = await request(server)
      .post(`${articleRouteValue}`)
      .send(articleToCreate)
      .set('Accept', 'application/json');

    expect(response.status).toBe(201);
    const data = response.body;
    const {createdArticle} = data;
    const createdArticleObj = _.pick(createdArticle, [...Object.keys(articleToCreate)]);
    expect(articleToCreate).toEqual(createdArticleObj);

    const responseUser = await request(server).get(`${userRouteValue}/${userToFind._id}`);
    expect(responseUser.status).toBe(200);
    const retrievedUser = responseUser.body.user;
    expect(retrievedUser.numberOfArticles).toBe(userToFind.numberOfArticles + 1);
    const targetArticle = retrievedUser.articles.find(article => article.id === createdArticle.id);
    expect(targetArticle).toBeTruthy();
  });

  test('gets article list', async () => {
    await seedDb(mongoose);

    const response = await request(server).get(`${articleRouteValue}`);
    expect(response.status).toBe(200);
    const data = response.body;
    expect(data.count).toBe(5);
    for (let article of data.articles) {
      expect(article.owner).toBeTruthy();
      expect(article.id).toBeTruthy();
    }
  });

  test('gets article list with filter', async () => {
    await seedDb(mongoose);

    const response = await request(server).get(`${articleRouteValue}?category=history`);

    expect(response.status).toBe(200);
    const data = response.body;
    expect(data.count).toBe(2);

    for (let article of data.articles) {
      expect(article.owner).toBeTruthy();
      expect(article.id).toBeTruthy();
      expect(article.category).toBe('history');
    }
  });

  test('deletes article', async () => {
    const {authors, articles} = await seedDb(mongoose);
    const articleToDelete = articles[0];
    const userToFind = authors[0];

    const response = await request(server)
      .delete(`${articleRouteValue}/${articleToDelete._id}`)
      .send({
        owner: articleToDelete.owner
      })
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    const data = response.body;
    expect(data.message).toBe('article was deleted');
    expect(data.deleteResult.deletedCount).toBe(1);

    const responseUser = await request(server).get(`${userRouteValue}/${userToFind._id}`);
    expect(responseUser.status).toBe(200);
    const retrievedUser = responseUser.body.user;
    expect(retrievedUser.numberOfArticles).toBe(userToFind.numberOfArticles - 1);
    const targetArticle = retrievedUser.articles.find(article => article.id === articleToDelete.id);
    expect(targetArticle).toBeFalsy();
  });
});
