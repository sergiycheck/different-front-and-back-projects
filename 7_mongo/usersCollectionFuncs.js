const {mapUser} = require('./util');

const collections = require('./appCollections');

async function create2UsersPerDepartment(...departments) {
  const maxUsersCount = 6;
  try {
    const usersCount = await collections.users.find({}).count();

    if (usersCount >= maxUsersCount) {
      console.log(`user count ${usersCount}`);
      return;
    }

    for (let department of departments) {
      const user1 = mapUser({department});
      const user2 = mapUser({department});

      const usersInsertResult = await collections.users.insertMany([user1, user2]);

      console.log(`${usersInsertResult.insertedCount} users were inserted`);
    }
  } catch (err) {
    console.error(err);
  }
}

// - Delete 1 user from department (a)

async function delete1UserFromDepartment(departmentName) {
  try {
    const deleteResult = await collections.users.deleteOne({
      department: {
        $eq: `${departmentName}`
      }
    });

    console.log(`${deleteResult.deletedCount} user deleted `);
  } catch (err) {
    console.error(err);
  }
}

// - Update firstName for users from department (b)

async function updateFirstNameForUsersFromDepartment(departmentName) {
  try {
    const updateResult = await collections.users.updateMany(
      {
        department: `${departmentName}`
      },
      {
        $set: {
          firstName: 'UpdatedFirstName'
        }
      }
    );
    console.log(`${updateResult.modifiedCount} students updated`);
  } catch (err) {
    console.error(err);
  }
}

// - Find all users from department (c)
async function findAllUsersFromDepartment(departmentName) {
  try {
    const users = await collections.users
      .find({
        department: {
          $eq: `${departmentName}`
        }
      })
      .toArray();
    console.log('users found', users);
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  create2UsersPerDepartment,
  delete1UserFromDepartment,
  updateFirstNameForUsersFromDepartment,
  findAllUsersFromDepartment
};
