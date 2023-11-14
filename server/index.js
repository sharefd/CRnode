require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const userRouter = require('./routes/userRouter');
const articlesRouter = require('./routes/articlesRouter');
const requestsRouter = require('./routes/requestsRouter');
const feedbackRouter = require('./routes/feedbackRouter');
const purposesRouter = require('./routes/purposesRouter');
const invitesRouter = require('./routes/invitesRouter');
const authRouter = require('./routes/authRouter');

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

if (process.env.NODE_ENV !== 'development') {
  app.use(express.static(path.join(__dirname, 'dist')));
}

app.use('/api/users', userRouter);
app.use('/api/articles', articlesRouter);
app.use('/api/requests', requestsRouter);
app.use('/api/feedbacks', feedbackRouter);
app.use('/api/purposes', purposesRouter);
app.use('/api/invites', invitesRouter);
app.use('/auth', authRouter);

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('Invalid or missing token');
  }
});

if (process.env.NODE_ENV !== 'development') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(process.env.PORT || 3003, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});
