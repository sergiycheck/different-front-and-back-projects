const {mapArticle, getRandomInt} = require('./util');
const collections = require('./appCollections');

// maxArticlesCount = 15;
async function create5ArticlesOfEachType(...articleTypes) {
  try {
    for (let articleType of articleTypes) {
      const insertManyResult = await collections.articles.insertMany([
        mapArticle({type: articleType}),
        mapArticle({type: articleType}),
        mapArticle({type: articleType}),
        mapArticle({type: articleType}),
        mapArticle({type: articleType})
      ]);

      console.log(`${insertManyResult.insertedCount} articles inserted`);
    }
  } catch (error) {
    console.error(error);
  }
}

async function findArticlesByTypeAndUpdateTagList(articleType, tagListToUpdate) {
  try {
    const query = {
      type: articleType
    };

    const update = {
      $set: {
        tags: tagListToUpdate
      }
    };

    const updateResult = await collections.articles.updateMany(query, update);

    console.log(`${updateResult.modifiedCount} articles updated`);
  } catch (error) {
    console.error(error);
  }
}

async function updateOtherArticleTagsExceptOne(articleTypeToExclude, tagListToUpdate) {
  try {
    const query = {
      type: {
        $ne: articleTypeToExclude
      }
    };

    const update = {
      $set: {
        tags: tagListToUpdate
      }
    };

    const updateResult = await collections.articles.updateMany(query, update);

    console.log(`${updateResult.modifiedCount} articles updated`);
  } catch (error) {
    console.error(error);
  }
}

async function findAllArticlesThatContainsTags(tagListToInclude) {
  try {
    const query = {
      tags: {
        $in: [...tagListToInclude]
      }
    };

    const foundArticles = await collections.articles.find(query).toArray();

    console.log(`${foundArticles.length} articles were found`, foundArticles);
  } catch (error) {
    console.error(error);
  }
}

async function removeTagsFromArticlesTagList(tagListToRemove) {
  try {
    const update = {
      $pull: {
        tags: {
          $in: [...tagListToRemove]
        }
      }
    };

    const updateResult = await collections.articles.updateMany({}, update);

    console.log(`${updateResult.modifiedCount} articles updated`);
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  create5ArticlesOfEachType,
  findArticlesByTypeAndUpdateTagList,
  updateOtherArticleTagsExceptOne,
  findAllArticlesThatContainsTags,
  removeTagsFromArticlesTagList
};
