// models/NewsFeed.js

const mongoose = require('mongoose');

const newsFeedSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String },
  videoUrl: { type: String },
  status: { type: String, default: 'draft' },
  createdAt: { type: Date, default: Date.now },
  comments: [String],
  likes: { type: Number, default: 0 },
  shares: { type: Number, default: 0 }
});

const NewsFeed = mongoose.model('NewsFeed', newsFeedSchema);

module.exports = NewsFeed;
