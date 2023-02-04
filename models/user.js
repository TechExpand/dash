const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create user schema & model
const UserSchema = new Schema({
    email: {
        type: String,
        // required: [true, 'email field is required']
    },
   
	phone: {
        type: String,
        required: [true, 'phone field is required']
    },

    password: {
        type: String,
        required: [true, 'password field is required']
    },

    surname: {
        type: String,
        // required: [true, 'surname field is required']
    },
    
	image: String,
	accountType: {
        type: String,
        required: [true, 'accountType field is required']
    },
    status: {
        type: String,
        required: [true, 'status field is required']
    },
    joined: {
        type: String,
        required: [true, 'joined field is required']
    },
    suspended: {
        type: Boolean,
        default: null
    }
});


const User = mongoose.model('user',UserSchema);

module.exports = User;