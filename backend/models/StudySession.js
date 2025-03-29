const mongoose = require('mongoose');

const studySessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date
  },
  duration: {
    type: Number,  // in minutes
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('StudySession', studySessionSchema); 