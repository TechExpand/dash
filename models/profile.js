const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const ProfileScema = new Schema({
    shipType: String,
    todayEarn: String,
    rate: String,
    status: Boolean,
    verified: Boolean,
    user: { type: Schema.Types.ObjectId, ref: 'user' },
  });
  
  const Profile = mongoose.model('profile', ProfileScema);

  module.exports = Profile;