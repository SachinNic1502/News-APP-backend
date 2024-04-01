const express = require('express');
const bodyParser = require('body-parser');
const newsFeedRoutes = require('./routes/newsFeedRoutes');
const userRooutes = require('./routes/userRoutes');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/news-feed', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(error => {
  console.error('Error connecting to MongoDB:', error.message);
});
app.use(bodyParser.json());
app.use(cors());
app.use('/news-feeds', newsFeedRoutes);
app.use('/users', userRooutes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
