const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  firstName: {type: String, required: true, minlength: 4, maxlength: 50},
  lastName: {type: String, required: true, minlength: 3, maxlength: 60},
  nickname: {type: String, minlength: 4},
  role: {type: String, enum: ['admin', 'writer', 'guest']},

  createdAt: {type: Date, default: Date.now, required: true},
  numberOfArticles: {type: Number, default: 0},

  articles: [
    {
      type: mongoose.ObjectId,
      ref: 'Article'
    }
  ]
});

module.exports = mongoose.model('User', userSchema);
