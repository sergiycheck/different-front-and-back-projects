const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: {type: String, required: true, minlength: 5, maxlength: 400, text: true},
  subtitle: {type: String, minlength: 5},
  description: {type: String, required: true, minlength: 5, maxlength: 5000},

  category: {type: String, enum: ['sport', 'games', 'history'], required: true},

  createdAt: {type: Date, default: Date.now, required: true},
  updatedAt: {type: Date, default: Date.now, required: true},

  owner: {
    type: mongoose.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Article', articleSchema);
