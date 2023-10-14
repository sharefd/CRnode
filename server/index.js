require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRouter = require('./routes/userRouter');
const articlesRouter = require('./routes/articlesRouter');
var { expressjwt: jwt } = require('express-jwt');

const jwtMiddleware = jwt({
  secret: 'secret',
  algorithms: ['HS256'],
  userProperty: 'auth'
});

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

app.use('/api/articles', articlesRouter);

app.use('/api/users', userRouter);

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('Invalid or missing token');
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});
