const mongoose = require('mongoose');

// Define the schema
const tripSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true
  },
  travellers: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  }
});

// Create the model
const Contact = mongoose.model('Contact', tripSchema);

module.exports = Contact;
