'use strict';

const env = process.env.NODE_ENV || 'local';
const _config = require('./_config.json')[env];

const MongoClient = require('mongodb').MongoClient;

const state = {
  db: null,
  client: null
};

module.exports.connect = () => {
  return new Promise(async (resolve, reject) => {
    if (state.db) return resolve();

    const {database, dbConfig, dbName} = _config;

    try {
      const client = await MongoClient.connect(database, dbConfig);
      console.log('Connection established');
      state.db = client.db(dbName);
      state.client = client;
      return resolve();
    } catch (error) {
      return reject(err);
    }
  });
};

module.exports.get = () => {
  return state.db;
};

module.exports.close = async () => {
  if (!state.db) return;

  console.log('closing connection');

  await state.client.close();
  state.db = null;
  state.mode = null;
};
