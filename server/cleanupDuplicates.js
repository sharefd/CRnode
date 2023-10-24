require('dotenv').config();
const mongoose = require('mongoose');
const Request = require('./models/Request');
const Permission = require('./models/Permission');

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const removeDuplicates = async () => {
  const allRequests = await Request.find({}).lean();

  const uniqueRequests = new Map();

  for (const request of allRequests) {
    const key = `${request.user.username}-${request.purpose}-${request.status}`;

    const userPermission = await Permission.findOne({ userId: request.user._id, purpose: request.purpose }).lean();

    if (userPermission && userPermission.canRead) {
      await Request.deleteOne({ _id: request._id });
      console.log(`Deleted unnecessary request with ID: ${request._id}`);
    } else if (uniqueRequests.has(key)) {
      await Request.deleteOne({ _id: request._id });
      console.log(`Deleted duplicate request with ID: ${request._id}`);
    } else {
      uniqueRequests.set(key, request._id);
    }
  }
};

removeDuplicates()
  .then(() => {
    console.log('Request cleanup complete');
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error during request cleanup:', err);
    mongoose.connection.close();
  });
