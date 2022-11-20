const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const TokenScema = new Schema({
    token: String,
    user: { type: Schema.Types.ObjectId, ref: 'user' },
  });
  
  const Token = mongoose.model('Token', TokenScema);

  module.exports = Token;