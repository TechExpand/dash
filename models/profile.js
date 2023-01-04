const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const date = new Date();

const ProfileScema = new Schema({
    shipType: String,
    todayEarn:{ type: String, default: 0},
    totalEarn:{ type: String,  default: 0},
    commisionBalance: { type: String,  default: 0},
    lastUpdatedTodayEarn: { type: String,  default: date.toString()},
    rate: String,
    status: Boolean,
    verified: Boolean,
    user: { type: Schema.Types.ObjectId, ref: 'user' },
  });
  
  const Profile = mongoose.model('profile', ProfileScema);

  module.exports = Profile;