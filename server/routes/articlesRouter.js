const express = require('express');
const Article = require('../models/Article');
const router = express.Router();
const { checkPermissions, jwtMiddleware } = require('../middleware/permissions');

router.get('/', async (req, res) => {
  try {
    const articles = await Article.find().populate('organizer', 'username').exec();

    res.json(articles);
  } catch (err) {
    console.error('There was an error fetching articles:', err);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/new', jwtMiddleware, async (req, res) => {
  try {
    const newArticle = new Article(req.body);
    await newArticle.save();
    res.json(newArticle);
  } catch (err) {
    console.error('Error creating article:', err);
    res.status(500).send('Internal Server Error');
  }
});

router.put('/:id', jwtMiddleware, async (req, res) => {
  const article = await Article.findById(req.params.id);

  for (let key in req.body) {
    article[key] = req.body[key];
  }

  await article.save();
  res.json(article);
});

router.delete('/:id', jwtMiddleware, async (req, res) => {
  const article = await Article.findById(req.params.id);
  await article.remove();
  res.json({ message: 'Article deleted' });
});

module.exports = router;
