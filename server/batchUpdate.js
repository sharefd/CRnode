require('dotenv').config();
const mongoose = require('mongoose');
const Purpose = require('./models/Purpose');
const Permission = require('./models/Permission');

async function resetPermissions() {
  // Delete all permissions
  await Permission.deleteMany({});
  console.log('Deleted all permissions.');

  // Fetch all purposes
  const purposes = await Purpose.find({});

  // User IDs to be added to canReadMembers and canWriteMembers arrays
  const userIds = ['652afc81943693052e4910c0', '652afe1b58a9a2f617ea7206'];

  // Update each purpose's canReadMembers and canWriteMembers arrays
  for (const purpose of purposes) {
    purpose.canReadMembers = [...new Set([...purpose.canReadMembers, ...userIds])];
    purpose.canWriteMembers = [...new Set([...purpose.canWriteMembers, ...userIds])];
    await purpose.save();
  }
  console.log('Updated canReadMembers and canWriteMembers for all purposes.');
}

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(async () => {
    console.log('MongoDB connected');
    await resetPermissions();

    console.log('Migration completed');
    mongoose.connection.close();
  })
  .catch(err => {
    console.log(err);
    mongoose.connection.close();
  });
