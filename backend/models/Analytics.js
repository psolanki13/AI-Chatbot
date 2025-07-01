const mongoose = require('mongoose');

// Analytics Schema for tracking usage
const analyticsSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
    index: true
  },
  totalMessages: {
    type: Number,
    default: 0
  },
  totalConversations: {
    type: Number,
    default: 0
  },
  averageMessagesPerConversation: {
    type: Number,
    default: 0
  },
  apiResponseTime: {
    type: Number, // in milliseconds
    default: 0
  },
  errorCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Ensure unique date entries (removed duplicate index)
analyticsSchema.index({ date: 1 }, { unique: true });

// Static method to update daily stats
analyticsSchema.statics.updateDailyStats = async function(messageCount = 1, responseTime = 0, hasError = false) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const update = {
    $inc: {
      totalMessages: messageCount,
      ...(hasError && { errorCount: 1 })
    },
    $push: {
      ...(responseTime > 0 && { responseTimes: responseTime })
    }
  };
  
  return this.findOneAndUpdate(
    { date: today },
    update,
    { upsert: true, new: true }
  );
};

const Analytics = mongoose.model('Analytics', analyticsSchema);

module.exports = Analytics;
