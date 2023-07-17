const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  imageURL: {
    type: String,
    required: true,
  },
  placeName: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  heading: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;