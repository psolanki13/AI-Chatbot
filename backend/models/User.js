const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  firstName: String,
  lastName: String,
  profileImage: String,
  subscription: {
    type: String,
    enum: ['free', 'pro'],
    default: 'free'
  },
  apiUsage: {
    type: Number,
    default: 0
  },
  maxApiUsage: {
    type: Number,
    default: 100 // Free tier limit
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
