const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const BankScema = new Schema({
    name: String,
    account: String,
    bank: String,
    user: { type: Schema.Types.ObjectId, ref: 'user' },
    code: String,
  });
  
  const Bank = mongoose.model('bank', BankScema);

  module.exports = Bank;