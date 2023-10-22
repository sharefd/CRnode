const User = require('./models/User');
const Permission = require('./models/Permission');
const mongoose = require('mongoose');

async function populatePermissions() {
  const users = await User.find({}).lean();

  const permissionMap = {};

  for (const user of users) {
    for (const { purpose, canRead, canWrite } of user.permissions) {
      if (!permissionMap[purpose]) {
        permissionMap[purpose] = { canRead: [], canWrite: [] };
      }

      if (canRead) {
        permissionMap[purpose].canRead.push(user._id);
      }

      if (canWrite) {
        permissionMap[purpose].canWrite.push(user._id);
      }
    }
  }

  for (const [purpose, { canRead, canWrite }] of Object.entries(permissionMap)) {
    console.log(permissionMap);
    await Permission.findOneAndUpdate({ purpose }, { canRead, canWrite }, { upsert: true, new: true });
  }

  console.log('Permissions table populated.');
}

async function main() {
  await mongoose.connect(
    'mongodb+srv://sharif:zXQi4EfWJiujT37P@cluster0.aqklonr.mongodb.net/cloudrounds?retryWrites=true&w=majority'
  );

  await populatePermissions();

  await mongoose.disconnect();
}

main().catch(console.error);
