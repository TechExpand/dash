const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const VerificationScema = new Schema({
    status: String,
    doc: [{ type: String }],
    date: String,
    user: { type: Schema.Types.ObjectId, ref: 'user' },
  });
  
  const Verification = mongoose.model('verification', VerificationScema);

  module.exports = Verification;