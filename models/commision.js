const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const CommisionScema = new Schema({
    amount: String,
    date: String,
    user: { type: Schema.Types.ObjectId, ref: 'user' },
  });
  
  const Commision = mongoose.model('commision', CommisionScema);

  module.exports = Commision;