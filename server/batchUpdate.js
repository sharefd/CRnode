require('dotenv').config();
const mongoose = require('mongoose');
const Purpose = require('./models/Purpose');
const Article = require('./models/Article');
const Request = require('./models/Request'); // Importing the Request model

async function updatePurposesUniqueMembers() {
  try {
    const purposes = await Purpose.find();

    for (const purpose of purposes) {
      const uniqueCanReadMembers = [...new Set(purpose.canReadMembers.map(member => member.toString()))];
      const uniqueCanWriteMembers = [...new Set(purpose.canWriteMembers.map(member => member.toString()))];

      if (
        uniqueCanReadMembers.length !== purpose.canReadMembers.length ||
        uniqueCanWriteMembers.length !== purpose.canWriteMembers.length
      ) {
        purpose.canReadMembers = uniqueCanReadMembers;
        purpose.canWriteMembers = uniqueCanWriteMembers;
        await purpose.save();
      }
    }

    console.log('All purposes have been updated with unique members.');
  } catch (error) {
    console.error('Failed to update purposes:', error);
  }
}

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(async () => {
    console.log('MongoDB connected');

    await updatePurposesUniqueMembers();

    mongoose.connection.close();
  })
  .catch(err => {
    console.error(err);
    mongoose.connection.close();
  });
