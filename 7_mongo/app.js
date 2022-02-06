'use strict';

const connection = require('./config/connection');

const collections = require('./appCollections');

const {
  create2UsersPerDepartment,
  delete1UserFromDepartment,
  updateFirstNameForUsersFromDepartment,
  findAllUsersFromDepartment
} = require('./usersCollectionFuncs');

const {
  create5ArticlesOfEachType,
  findArticlesByTypeAndUpdateTagList,
  updateOtherArticleTagsExceptOne,
  findAllArticlesThatContainsTags,
  removeTagsFromArticlesTagList
} = require('./articlesCollectionFuncs');

run();

async function run() {
  await connection.connect();
  const db = connection.get();

  // await workWithUsersCollection(db);
  await workWithArticlesCollection(db);

  await connection.close();
}

async function workWithUsersCollection(db) {
  await resetCreateCollection(db, 'users');

  await create2UsersPerDepartment('a', 'b', 'c');
  await delete1UserFromDepartment('a');
  await updateFirstNameForUsersFromDepartment('b');
  await findAllUsersFromDepartment('c');
}

async function workWithArticlesCollection(db) {
  await resetCreateCollection(db, 'articles');

  await create5ArticlesOfEachType('a', 'b', 'c');

  await findArticlesByTypeAndUpdateTagList('a', ['tag1-a', 'tag2-a', 'tag3']);

  await updateOtherArticleTagsExceptOne('a', ['tag2', 'tag3', 'super']);

  await findAllArticlesThatContainsTags(['tag2', 'tag1-a']);

  await removeTagsFromArticlesTagList(['tag2', 'tag1-a']);
}

async function resetCreateCollection(db, collectionName) {
  const collectionFromDb = await db.listCollections({name: collectionName}).toArray();

  if (collectionFromDb.length) {
    await db.dropCollection(collectionName);
    await db.createCollection(collectionName);
  } else {
    await db.createCollection(collectionName);
  }

  collections[collectionName] = db.collection(collectionName);
}
