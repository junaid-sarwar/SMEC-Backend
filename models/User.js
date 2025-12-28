// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
    type: String,
    required: true
  },
  phoneNumber:{
        type:Number,
        required:true
    },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role:{
        type:String,
        enum:['buyer','admin'],
        required:true,
        default: 'buyer'
    },
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);