const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const LocationScema = new Schema({
    lan: String,
    long: Sting,
    user: { type: Schema.Types.ObjectId, ref: 'user' },
  });
  
  const Location = mongoose.model('Location', LocationScema);

  module.exports = Location;