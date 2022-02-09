const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');

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
    await request(server)
      .get('/api/default')
      .expect(200)
      .then(response => {
        expect(response.body.message).toBe('working api');
      });
  });

  test('creates user', async () => {
    await request(server)
      .post('/api/users')
      .send({
        firstName: 'Leanne',
        lastName: 'Graham',
        nickname: 'leane1Gra',
        role: 'guest'
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)
      .then(response => {
        const data = response.body;

        expect(data.createdUser.firstName).toBe('Leanne');
        expect(data.createdUser._id).toBeTruthy();
      });
  });
});
