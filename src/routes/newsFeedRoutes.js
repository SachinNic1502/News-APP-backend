const express = require('express');
const router = express.Router();
const newsFeedController = require('../controllers/newsFeedController');

// Get all news feeds
router.get('/', newsFeedController.getAllNewsFeeds);

// Get news feed by ID
// router.get('/:id', newsFeedController.getNewsFeedById);

// Create a new news feed
router.post('/', newsFeedController.createNewsFeed);

// Update a news feed by ID
router.put('/:id', newsFeedController.updateNewsFeed);

// Delete a news feed by ID
router.delete('/:id', newsFeedController.deleteNewsFeed);

// Increment likes of a news feed
router.post('/:id/like', newsFeedController.incrementLikes);

// Increment shares of a news feed
router.post('/:id/share', newsFeedController.incrementShares);

// add Comment to a news feed
router.post('/:id/comment', newsFeedController.addComment);

// Get top shared news feeds
router.get('/top/shared', newsFeedController.getTopSharedNewsFeeds);

// Get top liked news feeds
router.get('/top/liked', newsFeedController.getTopLikedNewsFeeds);

// Get top commented news feeds
router.get('/top/commented', newsFeedController.getTopCommentedNewsFeeds);

// Get latest news feeds
router.get('/latest', newsFeedController.fetchLatestNews);

// Get draft news feeds
router.get('/draft', newsFeedController.fetchDraftNews);

// Get published news feeds
router.get('/published', newsFeedController.fetchPublisheNews);


// Publish a news feed
router.put('/publish/:id', newsFeedController.publishNewsFeed);
  

module.exports = router;
