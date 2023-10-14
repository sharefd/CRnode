const express = require('express');
const Article = require('../models/Article');
const router = express.Router();
const checkPermissions = require('../middleware/checkPermissions');

router.get('/', async (req, res) => {
  try {
    const articles = await Article.find().populate('organizer', 'username').exec();

    res.json(articles);
  } catch (err) {
    console.error('There was an error fetching articles:', err);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/new', checkPermissions('create_article'), async (req, res) => {
  const newArticle = new Article(req.body);
  await newArticle.save();
  res.json(newArticle);
});

router.put('/:id', checkPermissions('update_article'), async (req, res) => {
  const article = await Article.findById(req.params.id);
  article.title = req.body.title;
  article.body = req.body.body;
  await article.save();
  res.json(article);
});

router.delete('/:id', checkPermissions('delete_article'), async (req, res) => {
  const article = await Article.findById(req.params.id);
  await article.remove();
  res.json({ message: 'Article deleted' });
});

module.exports = router;
