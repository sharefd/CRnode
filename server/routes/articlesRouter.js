const express = require('express');
const Article = require('../models/Article');
const router = express.Router();
const { jwtMiddleware } = require('../middleware/permissions');

router.get('/', async (req, res) => {
  try {
    const articles = await Article.find().populate('organizer').populate('purpose');

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

    const populatedArticle = await Article.findById(newArticle._id).populate('organizer').populate('purpose');

    res.json(populatedArticle);
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

  const populatedArticle = await Article.findById(article._id).populate('organizer').populate('purpose');

  res.json(populatedArticle);
});

router.delete('/:id', jwtMiddleware, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    await Article.deleteOne({ _id: req.params.id });
    res.json({ message: 'Article deleted' });
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
