require('dotenv').config();
const mongoose = require('mongoose');
const Purpose = require('./models/Purpose');
const Article = require('./models/Article');
const Request = require('./models/Request'); // Importing the Request model

async function updateCreator() {
  const defaultCreatorId = '652afc81943693052e4910c0';

  try {
    // Find all purposes without a creator and set the default creator
    const result = await Purpose.updateMany(
      { creator: { $exists: false } }, // filter: purposes without a creator
      { $set: { creator: defaultCreatorId } } // update: set the default creator
    );

    console.log(`${result.nModified} purposes updated with default creator.`);
  } catch (err) {
    console.error('Error updating purposes with default creator:', err);
  }
}

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(async () => {
    console.log('MongoDB connected');

    // Remove emailList field for all records in the Purpose collection
    await updateCreator();

    mongoose.connection.close();
  })
  .catch(err => {
    console.log(err);
    mongoose.connection.close();
  });
