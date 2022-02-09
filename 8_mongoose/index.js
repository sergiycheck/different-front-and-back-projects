const mongoose = require('mongoose');

async function connectToDb() {
  const dev_db_url = 'mongodb://localhost/tc-mongo-homework';
  const mongoDB = process.env.MONGODB_URI || dev_db_url;
  try {
    await mongoose.connect(mongoDB);

    mongoose.set('debug', {shell: true});
  } catch (error) {
    console.log(error);
  }
}

connectToDb().then(() => {
  const app = require('./app');

  const port = 4045;

  app.listen(port, () => {
    console.log('Server is up and running on port numner ' + port);
  });
});
