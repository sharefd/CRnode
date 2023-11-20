require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function validateAllExistingEmails() {
  try {
    const result = await User.updateMany(
      {}, // This empty object means "match all documents"
      { $set: { emailValidated: true } }
    );
    console.log('Email validation update result:', result);
  } catch (err) {
    console.error('Error updating users:', err);
  }
}

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(async () => {
    console.log('MongoDB connected');

    await validateAllExistingEmails();

    mongoose.connection.close();
  })
  .catch(err => {
    console.error(err);
    mongoose.connection.close();
  });
