const mongoose = require('mongoose');

// Conversation Schema
const conversationSchema = new mongoose.Schema({
  userId: {
    type: String, // Clerk user ID
    required: true,
    index: true
  },
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    default: 'New Conversation'
  },
  messages: [{
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better performance
conversationSchema.index({ userId: 1, createdAt: -1 });
conversationSchema.index({ userId: 1, updatedAt: -1 });
conversationSchema.index({ userId: 1, sessionId: 1 });

// Update the updatedAt field before saving
conversationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Static method to find active conversations
conversationSchema.statics.findActiveConversations = function() {
  return this.find({ isActive: true }).sort({ updatedAt: -1 });
};

// Instance method to add a message
conversationSchema.methods.addMessage = function(role, content) {
  this.messages.push({
    role,
    content,
    timestamp: new Date()
  });
  this.updatedAt = new Date();
  
  // Update title based on first user message
  if (this.title === 'New Conversation' && role === 'user' && this.messages.length === 1) {
    this.title = content.substring(0, 50) + (content.length > 50 ? '...' : '');
  }
  
  return this.save();
};

// Instance method to get conversation history
conversationSchema.methods.getHistory = function(limit = 20) {
  return this.messages
    .slice(-limit)
    .map(msg => ({
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp
    }));
};

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;
