const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const DeliveryScema = new Schema({
    state: String,
    shipType: String,
    price: String,
    owner: { type: Schema.Types.ObjectId, ref: 'user' , default: null},
    reciever: { type: Schema.Types.ObjectId, ref: 'user' , default: null},
    senderName: String,
    senderPhone: String,
    recieverName: String,
    recieverPhone: String,
    pickupLan: String,
    dropoffLan: String,
    pickupLog: String,
    itemName: String,
    dropoffLog: String,
    mode: String,
    status: String,
  });
  
  const Delivery = mongoose.model('delivery', DeliveryScema);

  module.exports = Delivery;