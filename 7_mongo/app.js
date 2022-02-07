'use strict';

const connection = require('./config/connection');

const collections = require('./appCollections');

const studentsArr = require('./students.json');

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

const {
  findAllStudentsWithTheWorstHWScore,
  findAllStudentsWithTheBestScoreForQuizAndWorstHW,
  averageHomeworkScore,
  deleteStudentsWithScoreLessThan,
  markStudentsThatHaveQuizScoreMoreThanSpecified,
  bucketGroupByAverageGrade,
  findAllStudentsWithTheBestScoreForQuizAndExam
} = require('./studentQueries');

run();

async function run() {
  await connection.connect();
  const db = connection.get();

  await workWithUsersCollection(db);

  await workWithArticlesCollection(db);

  await workWithStudentsCollection(db);

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

async function workWithStudentsCollection(db) {
  await resetCreateCollection(db, 'students');

  await collections.students.insertMany(studentsArr);

  const studentsCount = await collections.students.find({}).count();

  if (!studentsCount) {
    console.log('import json file into db');
    return;
  }

  // - Find all students who have the worst score for homework, sort by descent
  await findAllStudentsWithTheWorstHWScore();

  // - Find all students who have the best score for quiz and the worst for homework, sort by ascending
  await findAllStudentsWithTheBestScoreForQuizAndWorstHW();

  // - Find all students who have best scope for quiz and exam
  await findAllStudentsWithTheBestScoreForQuizAndExam();

  // - Calculate the average score for homework for all students
  await averageHomeworkScore();

  // - Mark students that have quiz score => 80
  await markStudentsThatHaveQuizScoreMoreThanSpecified(80);

  // - Write a query that group students by 3 categories (calculate the average grade for three subjects)
  // - a => (between 0 and 40)
  // - b => (between 40 and 60)
  // - c => (between 60 and 100)
  await bucketGroupByAverageGrade();

  // - Delete all students that have homework score <= 60
  await deleteStudentsWithScoreLessThan(60);
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
