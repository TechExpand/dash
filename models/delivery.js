const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const DeliveryScema = new Schema({
    state: {
      type: String
    },
    shipType: {
      type: String
    },
    price: {
      type: String
    },
    owner: { type: Schema.Types.ObjectId, ref: 'user' , default: null},
    reciever: { type: Schema.Types.ObjectId, ref: 'user' , default: null},
    date: { type: String, default: null},
    itemName: {
      type: String
    },
    mode: {
      type: String
    },
    status: {
      type: String
    },

    deliveryinfo: [{ type:  Schema.Types.ObjectId, default: null , ref: 'deliveryinfo'}]
  });
  
  const Delivery = mongoose.model('delivery', DeliveryScema);

  module.exports = Delivery;