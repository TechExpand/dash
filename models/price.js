const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const priceScema = new Schema({
    average: {type:Number, default: 150},
    minimum: {type:Number, default: 450},
    maximum: {type:Number, default: 200},
  });
  
  const Price = mongoose.model('price', priceScema);

  module.exports = Price;