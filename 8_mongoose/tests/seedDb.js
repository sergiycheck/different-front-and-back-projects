const UserModel = require('../models/user');
const ArticleModel = require('../models/article');

const seedDb = async mongoose => {
  try {
    const authors = await UserModel.create([
      {
        _id: new mongoose.Types.ObjectId(),
        firstName: 'Leanne',
        lastName: 'Graham',
        nickname: 'leane1Gra',
        role: 'guest'
      },
      {
        _id: new mongoose.Types.ObjectId(),
        firstName: 'Clementine',
        lastName: 'Bauch',
        nickname: 'Samantha',
        role: 'writer'
      },
      {
        _id: new mongoose.Types.ObjectId(),
        firstName: 'badFirstName',
        lastName: 'Howell',
        nickname: 'dweege3',
        role: 'admin'
      }
    ]);

    const articles = await ArticleModel.create([
      {
        _id: new mongoose.Types.ObjectId(),
        title: `article text 1`,
        subtitle: 'subtitle great',
        description: 'article description 1',
        category: 'history',
        owner: authors[0]._id
      },
      {
        _id: new mongoose.Types.ObjectId(),
        title: `article text ${getRandomInt(0, 100)}`,
        subtitle: 'subtitle great 2',
        description: 'article description 3',
        category: 'games',
        owner: authors[0]._id
      },
      {
        _id: new mongoose.Types.ObjectId(),
        title: `article title 3`,
        subtitle: 'subtitle arrogant',
        description: 'article description dark',
        category: 'history',
        owner: authors[1]._id
      },
      {
        _id: new mongoose.Types.ObjectId(),
        title: `article text ${getRandomInt(0, 100)}`,
        subtitle: 'subtitle bored',
        description: 'article description cute',
        category: 'sport',
        owner: authors[1]._id
      },
      {
        _id: new mongoose.Types.ObjectId(),
        title: `article text ${getRandomInt(0, 100)}`,
        subtitle: 'subtitle bright',
        description: 'article description defeated',
        category: 'games',
        owner: authors[2]._id
      }
    ]);

    for (let article of articles) {
      const ownerFromDb = authors.find(author => author._id.valueOf() === article.owner.valueOf());

      await UserModel.findOneAndUpdate(
        {_id: article.owner},
        {
          $set: {numberOfArticles: ++ownerFromDb.numberOfArticles},
          $push: {articles: article._id}
        },
        {new: true}
      );
    }

    return {authors, articles};
  } catch (error) {
    console.log('an error occurred', error);
  }
};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

module.exports = seedDb;
