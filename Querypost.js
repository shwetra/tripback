const mongoose = require('mongoose');

const formDataSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  travelerNumber: {
    type: Number,
    required: true,
  },
});

const QueryData= mongoose.model('QueryData', formDataSchema);
module.exports = QueryData;
