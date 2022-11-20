const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const ReviewScema = new Schema({
    rate: String,
    snippet: String,
    user: { type: Schema.Types.ObjectId, ref: 'user' },
    date: String,
    poster: { type: Schema.Types.ObjectId, ref: 'user' },
  });
  
  const Review = mongoose.model('review', ReviewScema);

  module.exports = Review;