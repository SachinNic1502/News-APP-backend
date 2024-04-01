const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userController = {
  registerUser: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      // Check if user with the same email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = new User({
        username,
        email,
        password: hashedPassword
      });

      // Save the user to the database
      await newUser.save();

      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Error registering user:', error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Compare passwords
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });

      res.json({ message: 'Login successful', token });
    } catch (error) {
      console.error('Error logging in user:', error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  updateStatus: async (req, res) => {
    try {
      const { status } = req.body;
      const userId = req.userId; 

      // Update user's status
      console.log('userId:', userId);
      await User.findByIdAndUpdate(userId, { status });

      res.json({ message: 'Status updated successfully' });
    } catch (error) {
      console.error('Error updating status:', error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find({}, '-password'); // Exclude password field
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  getUserById: async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId, '-password'); // Exclude password field
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      console.error('Error fetching user by ID:', error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  countActiveUsers: async (req, res) => {
    try {
      const count = await User.countDocuments({ status: 'active' });
      res.json({ count });
    } catch (error) {
      console.error('Error counting active users:', error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  countInactiveUsers: async (req, res) => {
    try {
      const count = await User.countDocuments({ status: 'inactive' });
      res.json({ count });
    } catch (error) {
      console.error('Error counting inactive users:', error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

};


module.exports = userController;
