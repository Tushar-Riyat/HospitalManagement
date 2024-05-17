const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    email_verification: {
      type: Boolean,
      default: false
    },
    jobTitle: {
      type: String,
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
      required: true
    }
  },{timestamps:true});

const User = mongoose.model('user', userSchema);
module.exports = User;