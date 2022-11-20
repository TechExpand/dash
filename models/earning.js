const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const EarningScema = new Schema({
    amount: String,
    date: String,
    user: { type: Schema.Types.ObjectId, ref: 'user' },
  });
  
  const Earning = mongoose.model('earn', EarningScema);

  module.exports = Earning;