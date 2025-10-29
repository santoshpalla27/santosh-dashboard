const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { authenticate } = require('../middleware/auth');

// Models
const Note = require('../models/Note');
const Bookmark = require('../models/Bookmark');
const Goal = require('../models/Goal');
const Journal = require('../models/Journal');
const Idea = require('../models/Idea');
const Resource = require('../models/Resource');

// ============= NOTES =============
router.get('/notes', authenticate, async (req, res, next) => {
  try {
    const notes = await Note.find({ userId: req.user._id, isDeleted: false }).sort({ createdAt: -1 });
    res.json({ success: true, data: notes });
  } catch (error) {
    next(error);
  }
});

router.post('/notes', authenticate, [
  body('title').trim().notEmpty(),
  body('content').trim().notEmpty(),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const note = await Note.create({
      ...req.body,
      userId: req.user._id,
    });

    res.status(201).json({ success: true, data: note });
  } catch (error) {
    next(error);
  }
});

router.put('/notes/:id', authenticate, async (req, res, next) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!note) {
      return res.status(404).json({ success: false, error: 'Note not found' });
    }

    res.json({ success: true, data: note });
  } catch (error) {
    next(error);
  }
});

router.delete('/notes/:id', authenticate, async (req, res, next) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!note) {
      return res.status(404).json({ success: false, error: 'Note not found' });
    }

    res.json({ success: true, message: 'Note deleted' });
  } catch (error) {
    next(error);
  }
});

// ============= BOOKMARKS =============
router.get('/bookmarks', authenticate, async (req, res, next) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: bookmarks });
  } catch (error) {
    next(error);
  }
});

router.post('/bookmarks', authenticate, [
  body('title').trim().notEmpty(),
  body('url').trim().isURL(),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const bookmark = await Bookmark.create({
      ...req.body,
      userId: req.user._id,
    });

    res.status(201).json({ success: true, data: bookmark });
  } catch (error) {
    next(error);
  }
});

router.put('/bookmarks/:id', authenticate, async (req, res, next) => {
  try {
    const bookmark = await Bookmark.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!bookmark) {
      return res.status(404).json({ success: false, error: 'Bookmark not found' });
    }

    res.json({ success: true, data: bookmark });
  } catch (error) {
    next(error);
  }
});

router.delete('/bookmarks/:id', authenticate, async (req, res, next) => {
  try {
    const bookmark = await Bookmark.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!bookmark) {
      return res.status(404).json({ success: false, error: 'Bookmark not found' });
    }

    res.json({ success: true, message: 'Bookmark deleted' });
  } catch (error) {
    next(error);
  }
});

// ============= GOALS =============
router.get('/goals', authenticate, async (req, res, next) => {
  try {
    const goals = await Goal.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: goals });
  } catch (error) {
    next(error);
  }
});

router.post('/goals', authenticate, [
  body('title').trim().notEmpty(),
  body('progress').isInt({ min: 0, max: 100 }),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const goal = await Goal.create({
      ...req.body,
      userId: req.user._id,
    });

    res.status(201).json({ success: true, data: goal });
  } catch (error) {
    next(error);
  }
});

router.put('/goals/:id', authenticate, async (req, res, next) => {
  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!goal) {
      return res.status(404).json({ success: false, error: 'Goal not found' });
    }

    res.json({ success: true, data: goal });
  } catch (error) {
    next(error);
  }
});

router.delete('/goals/:id', authenticate, async (req, res, next) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!goal) {
      return res.status(404).json({ success: false, error: 'Goal not found' });
    }

    res.json({ success: true, message: 'Goal deleted' });
  } catch (error) {
    next(error);
  }
});

// ============= JOURNAL =============
router.get('/journal', authenticate, async (req, res, next) => {
  try {
    const entries = await Journal.find({ userId: req.user._id }).sort({ date: -1 });
    res.json({ success: true, data: entries });
  } catch (error) {
    next(error);
  }
});

router.post('/journal', authenticate, [
  body('title').trim().notEmpty(),
  body('content').trim().notEmpty(),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const entry = await Journal.create({
      ...req.body,
      userId: req.user._id,
      date: req.body.date || new Date(),
    });

    res.status(201).json({ success: true, data: entry });
  } catch (error) {
    next(error);
  }
});

router.put('/journal/:id', authenticate, async (req, res, next) => {
  try {
    const entry = await Journal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!entry) {
      return res.status(404).json({ success: false, error: 'Journal entry not found' });
    }

    res.json({ success: true, data: entry });
  } catch (error) {
    next(error);
  }
});

router.delete('/journal/:id', authenticate, async (req, res, next) => {
  try {
    const entry = await Journal.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!entry) {
      return res.status(404).json({ success: false, error: 'Journal entry not found' });
    }

    res.json({ success: true, message: 'Journal entry deleted' });
  } catch (error) {
    next(error);
  }
});

// ============= IDEAS =============
router.get('/ideas', authenticate, async (req, res, next) => {
  try {
    const ideas = await Idea.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: ideas });
  } catch (error) {
    next(error);
  }
});

router.post('/ideas', authenticate, [
  body('title').trim().notEmpty(),
  body('description').trim().notEmpty(),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const idea = await Idea.create({
      ...req.body,
      userId: req.user._id,
    });

    res.status(201).json({ success: true, data: idea });
  } catch (error) {
    next(error);
  }
});

router.put('/ideas/:id', authenticate, async (req, res, next) => {
  try {
    const idea = await Idea.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!idea) {
      return res.status(404).json({ success: false, error: 'Idea not found' });
    }

    res.json({ success: true, data: idea });
  } catch (error) {
    next(error);
  }
});

router.delete('/ideas/:id', authenticate, async (req, res, next) => {
  try {
    const idea = await Idea.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!idea) {
      return res.status(404).json({ success: false, error: 'Idea not found' });
    }

    res.json({ success: true, message: 'Idea deleted' });
  } catch (error) {
    next(error);
  }
});

// ============= RESOURCES =============
router.get('/resources', authenticate, async (req, res, next) => {
  try {
    const resources = await Resource.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: resources });
  } catch (error) {
    next(error);
  }
});

router.post('/resources', authenticate, [
  body('title').trim().notEmpty(),
  body('type').isIn(['Video', 'Article', 'Book', 'Course', 'Podcast', 'Tool', 'Tutorial', 'Documentation']),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const resource = await Resource.create({
      ...req.body,
      userId: req.user._id,
    });

    res.status(201).json({ success: true, data: resource });
  } catch (error) {
    next(error);
  }
});

router.put('/resources/:id', authenticate, async (req, res, next) => {
  try {
    const resource = await Resource.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!resource) {
      return res.status(404).json({ success: false, error: 'Resource not found' });
    }

    res.json({ success: true, data: resource });
  } catch (error) {
    next(error);
  }
});

router.delete('/resources/:id', authenticate, async (req, res, next) => {
  try {
    const resource = await Resource.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!resource) {
      return res.status(404).json({ success: false, error: 'Resource not found' });
    }

    res.json({ success: true, message: 'Resource deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;