require('dotenv').config();
const mongoose = require('mongoose');
const Purpose = require('./models/Purpose');
const Article = require('./models/Article');
const Request = require('./models/Request'); // Importing the Request model

async function convertStringIdsToObjectIds() {
  const articles = await Article.find();

  for (let article of articles) {
    article.purpose = mongoose.Types.ObjectId(article.purpose);
    await article.save();
  }

  console.log('Conversion complete!');
  mongoose.disconnect();
}

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(async () => {
    console.log('MongoDB connected');

    // Resetting purposes for both Article and Request models
    await convertStringIdsToObjectIds();

    mongoose.connection.close();
  })
  .catch(err => {
    console.log(err);
    mongoose.connection.close();
  });
