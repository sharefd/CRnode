require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRouter = require('./routes/userRouter');
const articlesRouter = require('./routes/articlesRouter');
const requestsRouter = require('./routes/requestsRouter');
const feedbackRouter = require('./routes/feedbackRouter');

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use('/api/users', userRouter);
app.use('/api/articles', articlesRouter);
app.use('/api/requests', requestsRouter);
app.use('/api/feedbacks', feedbackRouter);

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('Invalid or missing token');
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});
