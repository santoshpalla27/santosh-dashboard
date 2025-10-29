const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
    },
    description: String,
    tags: [String],
    favicon: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Bookmark', bookmarkSchema);