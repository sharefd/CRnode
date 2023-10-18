require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const PURPOSE_CHOICES = {
  OM1: 'OM Half-day',
  UOFTAMR: 'UofT Aerospace Rounds',
  MACIMAHD1: 'McMaster IM PGY-1 AHD',
  MACIMAHD2: 'McMaster IM PGY-2 AHD',
  MACIMAHD3: 'McMaster IM PGY-3 AHD'
};

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const updatePermissions = async () => {
  try {
    // Fetch all users
    const users = await User.find({});

    for (let user of users) {
      const newPermissions = Object.keys(PURPOSE_CHOICES).map(purpose => {
        return {
          purpose: purpose,
          canRead: true,
          canWrite: user.isAdmin
        };
      });

      user.permissions = newPermissions;

      await user.save();
    }

    console.log('All users updated successfully');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error updating users:', error);
    mongoose.connection.close();
  }
};

(async () => {
  try {
    await updatePermissions();
  } catch (error) {
    console.error('Unexpected error:', error);
  }
})();
