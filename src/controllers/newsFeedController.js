const NewsFeed = require('../models/newsFeedModel');

const newsFeedController = {
  getAllNewsFeeds: async (req, res) => {
    try {
      const newsFeeds = await NewsFeed.find();
      res.json(newsFeeds);
    } catch (error) {
      console.error('Error fetching news feeds:', error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  getNewsFeedById: async (req, res) => {
    try {
      const feedId = req.params.id;
      const feed = await NewsFeed.findById(feedId);
      if (!feed) {
        return res.status(404).json({ message: 'News feed not found' });
      }
      res.json(feed);
    } catch (error) {
      console.error('Error fetching news feed by ID:', error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  createNewsFeed: async (req, res) => {
    try {
      const { title, content, category, imageUrl, videoUrl } = req.body;
      // Validate request payload
      if (!title || !content || !category) {
        return res.status(400).json({ message: 'Title, content, and category are required' });
      }
      const newFeed = new NewsFeed({
        title,
        content,
        category,
        imageUrl,
        videoUrl,
        status: 'draft',
        createdAt: new Date(),
        comments: [],
        likes: 0
      });
      await newFeed.save();
      res.status(201).json({ message: 'News feed created successfully', data: newFeed });
    } catch (error) {
      console.error('Error creating news feed:', error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  updateNewsFeed: async (req, res) => {
    try {
      const feedId = req.params.id;
      const { title, content, category, imageUrl, videoUrl, status } = req.body;
      const updatedFeed = await NewsFeed.findByIdAndUpdate(feedId, {
        title,
        content,
        category,
        imageUrl,
        videoUrl,
        status
      }, { new: true });
      if (!updatedFeed) {
        return res.status(404).json({ message: 'News feed not found' });
      }
      res.json({ message: 'News feed updated successfully', data: updatedFeed });
    } catch (error) {
      console.error('Error updating news feed:', error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  deleteNewsFeed: async (req, res) => {
    try {
      const feedId = req.params.id;
      const deletedFeed = await NewsFeed.findByIdAndDelete(feedId);
      if (!deletedFeed) {
        return res.status(404).json({ message: 'News feed not found' });
      }
      res.json({ message: 'News feed deleted successfully' });
    } catch (error) {
      console.error('Error deleting news feed:', error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  addComment: async (req, res) => {
    try {
      const feedId = req.params.id;
      const { comment } = req.body;

      // Find the news feed by ID
      const newsFeed = await NewsFeed.findById(feedId);
      if (!newsFeed) {
        return res.status(404).json({ message: 'News feed not found' });
      }

      // Add the comment to the news feed
      newsFeed.comments.push(comment);
      await newsFeed.save();

      res.json({ message: 'Comment added successfully', data: newsFeed.comments });
    } catch (error) {
      console.error('Error adding comment:', error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  incrementLikes: async (req, res) => {
    try {
      const feedId = req.params.id;
      const updatedFeed = await NewsFeed.findByIdAndUpdate(feedId, { $inc: { likes: 1 } }, { new: true });
      if (!updatedFeed) {
        return res.status(404).json({ message: 'News feed not found' });
      }
      res.json({ message: 'Likes incremented successfully', likes: updatedFeed.likes });
    } catch (error) {
      console.error('Error incrementing likes:', error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  incrementShares: async (req, res) => {
    try {
      const feedId = req.params.id;
      const updatedFeed = await NewsFeed.findByIdAndUpdate(feedId, { $inc: { shares: 1 } }, { new: true });
      if (!updatedFeed) {
        return res.status(404).json({ message: 'News feed not found' });
      }
      res.json({ message: 'Shares incremented successfully', shares: updatedFeed.shares });
    } catch (error) {
      console.error('Error incrementing shares:', error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  getTopSharedNewsFeeds: async (req, res) => {
    try {
      const topSharedFeeds = await NewsFeed.find().sort({ shares: -1 }).limit(5);
      res.json(topSharedFeeds);
    } catch (error) {
      console.error('Error fetching top shared news feeds:', error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  getTopLikedNewsFeeds: async (req, res) => {
    try {
      const topLikedFeeds = await NewsFeed.find().sort({ likes: -1 }).limit(5);
      res.json(topLikedFeeds);
    } catch (error) {
      console.error('Error fetching top liked news feeds:', error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  getTopCommentedNewsFeeds: async (req, res) => {
    try {
      const topCommentedFeeds = await NewsFeed.aggregate([
        { $project: { _id: 1, title: 1, content: 1, category: 1, likes: 1, commentsCount: { $size: '$comments' } } },
        { $sort: { commentsCount: -1 } },
        { $limit: 10 }
      ]);
      res.json(topCommentedFeeds);
    } catch (error) {
      console.error('Error fetching top commented news feeds:', error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
   fetchLatestNews : async (req, res) => {
    try {
      const latestNews = await NewsFeed.find().sort({ createdAt: -1 }).limit(5);
      res.json(latestNews);
    } catch (error) {
      console.error('Error fetching latest news feeds:', error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  fetchDraftNews : async (req, res) => {
    try {
      const draftNews = await NewsFeed.find({ status: 'draft' }).sort({ createdAt: -1 }).limit(10);
      res.json(draftNews);
    } catch (error) {
      console.error('Error fetching draft news feeds:', error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  fetchPublisheNews : async (req, res) => {
    try {
      const publishedNews = await NewsFeed.find({ status: 'published' }).sort({ createdAt: -1 }).limit(10);
      res.json(publishedNews);
    } catch (error) {
      console.error('Error fetching published news feeds:', error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  publishNewsFeed: async (req, res) => {
    try {
      const feedId = req.params.id;
      const updatedFeed = await NewsFeed.findByIdAndUpdate(feedId, { status: 'published' }, { new: true });
      if (!updatedFeed) {
        return res.status(404).json({ message: 'News feed not found' });
      }
      res.json({ message: 'News feed published successfully', data: updatedFeed });
    } catch (error) {
      console.error('Error publishing news feed:', error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
  
   
};

module.exports = newsFeedController;