const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const VerifyScema = new Schema({
    serviceID: String,
    code: String,
  });
  
  const Verify = mongoose.model('verify', VerifyScema);

  module.exports = Verify;