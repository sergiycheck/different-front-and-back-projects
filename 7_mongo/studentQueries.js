const collections = require('./appCollections');

async function findAllStudentsWithTheWorstHWScore() {
  try {
    const pipeline = [
      {
        $addFields: {
          hwResult: {
            $filter: {
              input: '$scores',
              as: 'item',
              cond: {$eq: ['$$item.type', 'homework']}
            }
          }
        }
      },
      {
        $unwind: '$hwResult'
      },
      {
        $project: {
          scores: 0
        }
      },
      {
        $match: {'hwResult.score': {$lte: 40}}
      },
      {
        $sort: {'hwResult.score': -1}
      }
    ];

    const aggRes = await collections.students.aggregate(pipeline).toArray();

    console.log(aggRes);
  } catch (error) {
    console.error(error);
  }
}

async function averageHomeworkScore() {
  try {
    const pipeline = [
      {
        $unwind: '$scores'
      },
      {
        $match: {'scores.type': 'homework'}
      },
      {
        $match: {scores: {$ne: null}}
      },
      {
        $group: {
          _id: '$scores.type',
          averageScore: {$avg: '$scores.score'}
        }
      }
    ];

    const aggRes = await collections.students.aggregate(pipeline).toArray();

    console.log(aggRes);
  } catch (error) {
    console.error(error);
  }
}

async function deleteStudentsWithScoreLessThan(num) {
  try {
    const query = {scores: {$elemMatch: {type: 'homework', score: {$lte: Number(num)}}}};

    const deleteResult = await collections.students.deleteMany(query);

    console.log(`${deleteResult.deletedCount} students deleted`);
  } catch (error) {
    console.error(error);
  }
}

async function markStudentsThatHaveQuizScoreMoreThanSpecified(num) {
  try {
    const query = {
      scores: {$elemMatch: {type: 'quiz', score: {$gte: num}}}
    };

    const update = {
      $set: {marked: true}
    };

    const result = await collections.students.updateMany(query, update);

    console.log(`${result.modifiedCount} students updated`);
  } catch (error) {
    console.error(error);
  }
}

async function bucketGroupByAverageGrade() {
  try {
    const pipeline = [
      {
        $addFields: {
          averageGrade: {$avg: '$scores.score'}
        }
      },
      {
        $bucket: {
          groupBy: '$averageGrade',
          boundaries: [0, 40, 60, 100],
          default: 'Other',
          output: {
            count: {$sum: 1},
            students: {
              $push: {
                _id: '$_id',
                name: '$name',
                averageGrade: '$averageGrade'
              }
            }
          }
        }
      }
    ];

    const aggRes = await collections.students.aggregate(pipeline).toArray();

    console.log(aggRes);
  } catch (error) {
    console.error(error);
  }
}

async function findAllStudentsWithTheBestScoreForQuizAndWorstHW() {
  try {
    const pipeline = [
      {
        $addFields: {
          quizResult: {
            $filter: {
              input: '$scores',
              as: 'item',
              cond: {$eq: ['$$item.type', 'quiz']}
            }
          },

          hwResult: {
            $filter: {
              input: '$scores',
              as: 'item',
              cond: {$eq: ['$$item.type', 'homework']}
            }
          }
        }
      },
      {
        $unwind: '$quizResult'
      },
      {
        $unwind: '$hwResult'
      },
      {
        $project: {
          scores: 0
        }
      },
      {
        $match: {$and: [{'quizResult.score': {$gte: 90}}, {'hwResult.score': {$lte: 30}}]}
      },
      {
        $sort: {'quizResult.score': 1, 'hwResult.score': 1}
      }
    ];

    const aggRes = await collections.students.aggregate(pipeline).toArray();

    console.log(aggRes);
  } catch (error) {
    console.error(error);
  }
}

async function findAllStudentsWithTheBestScoreForQuizAndExam() {
  try {
    const pipeline = [
      {
        $addFields: {
          quizResult: {
            $filter: {
              input: '$scores',
              as: 'item',
              cond: {$eq: ['$$item.type', 'quiz']}
            }
          },

          examResult: {
            $filter: {
              input: '$scores',
              as: 'item',
              cond: {$eq: ['$$item.type', 'exam']}
            }
          }
        }
      },
      {
        $unwind: '$quizResult'
      },
      {
        $unwind: '$examResult'
      },
      {
        $project: {
          scores: 0
        }
      },
      {
        $match: {$and: [{'quizResult.score': {$gte: 90}}, {'examResult.score': {$gte: 90}}]}
      },
      {
        $sort: {'quizResult.score': -1, 'examResult.score': -1}
      }
    ];

    const aggRes = await collections.students.aggregate(pipeline).toArray();

    console.log(aggRes);
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  findAllStudentsWithTheWorstHWScore,
  findAllStudentsWithTheBestScoreForQuizAndWorstHW,
  averageHomeworkScore,
  deleteStudentsWithScoreLessThan,
  markStudentsThatHaveQuizScoreMoreThanSpecified,
  bucketGroupByAverageGrade,
  findAllStudentsWithTheBestScoreForQuizAndExam
};
