const mongoose = require('mongoose');

const noteschema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  favoriteCount: {
    type: Number,
    default: 0,
    required: true
  },
  favoritedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
});
const Note = mongoose.model('Note', noteschema);
module.exports = Note;
