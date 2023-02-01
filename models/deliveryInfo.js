const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const DeliveryInfoScema = new Schema({
    delivery: { type: Schema.Types.ObjectId, ref: 'delivery' , default: null},
    senderName: {
        type: String
      },
    senderPhone: {
        type: String
      },
    recieverName: {
        type: String
      },
    recieverPhone: {
        type: String
      },
    pickupLan: {
        type: String
      },
    dropoffLan: {
        type: String
      },
    pickup: {
        type: String
      },
    dropoff: {
        type: String
      },
    pickupLog: {
        type: String
      },
    dropoffLog: {
        type: String
      },
  });
  
  const DeliveryInfo = mongoose.model('deliveryinfo', DeliveryInfoScema);

  module.exports = DeliveryInfo;