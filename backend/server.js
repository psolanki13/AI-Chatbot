const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { v4: uuidv4 } = require('uuid');

// Database connection
const database = require('./config/database');
const { Conversation, Analytics } = require('./models');

// Clerk Authentication
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const { requireAuth, extractUser, optionalAuth } = require('./middleware/auth');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Validate required environment variables
if (!process.env.GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY is not set in environment variables');
  process.exit(1);
}

if (!process.env.CLERK_SECRET_KEY) {
  console.error('❌ CLERK_SECRET_KEY is not set in environment variables');
  console.log('📝 Please set up Clerk authentication keys in your .env file');
}

console.log('✅ Gemini API key found');
console.log('✅ Clerk configuration loaded');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Middleware
app.use(helmet());
app.use(limiter);
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      process.env.CORS_ORIGIN || 'http://localhost:3000',
      'https://your-frontend-url.vercel.app' // Will be updated after deployment
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'AI Chatbot Backend is running',
    timestamp: new Date().toISOString(),
    database: {
      status: database.getStatus(),
      connected: database.isConnected()
    }
  });
});

// Test API key endpoint
app.get('/api/test-api', async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent('Hello');
    const response = await result.response;
    const text = response.text();
    
    res.json({
      success: true,
      message: 'API key is working correctly',
      testResponse: text
    });
  } catch (error) {
    console.error('API Test Error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: {
        status: error.status,
        statusText: error.statusText
      }
    });
  }
});

// Get all conversations for authenticated user
app.get('/api/conversations', requireAuth, extractUser, async (req, res) => {
  try {
    const userId = req.userId;
    
    const conversations = await Conversation.find({ 
      userId, 
      isActive: true 
    })
      .select('sessionId title createdAt updatedAt messages')
      .sort({ updatedAt: -1 })
      .limit(50);

    const conversationsWithStats = conversations.map(conv => ({
      sessionId: conv.sessionId,
      title: conv.title,
      messageCount: conv.messages.length,
      createdAt: conv.createdAt,
      updatedAt: conv.updatedAt,
      lastMessage: conv.messages.length > 0 ? conv.messages[conv.messages.length - 1] : null
    }));

    res.json({
      success: true,
      conversations: conversationsWithStats,
      total: conversations.length
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch conversations'
    });
  }
});

// Get specific conversation for authenticated user
app.get('/api/conversations/:sessionId', requireAuth, extractUser, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.userId;
    
    const conversation = await Conversation.findOne({ 
      userId, 
      sessionId, 
      isActive: true 
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
    }

    res.json({
      success: true,
      conversation: {
        sessionId: conversation.sessionId,
        title: conversation.title,
        messages: conversation.messages,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt
      }
    });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch conversation'
    });
  }
});

// Delete conversation
app.delete('/api/conversations/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const conversation = await Conversation.findOneAndUpdate(
      { sessionId },
      { isActive: false },
      { new: true }
    );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
    }

    res.json({
      success: true,
      message: 'Conversation deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete conversation'
    });
  }
});

// Chat endpoint with authentication
app.post('/api/chat', requireAuth, extractUser, async (req, res) => {
  const startTime = Date.now();
  let hasError = false;

  try {
    const { message, conversationHistory = [], sessionId } = req.body;
    const userId = req.userId; // From Clerk auth

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        error: 'Message is required and must be a non-empty string'
      });
    }

    // Generate session ID if not provided
    const currentSessionId = sessionId || uuidv4();

    // Get the generative model (updated model name)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Get or create conversation in database for this user
    let conversation = await Conversation.findOne({ 
      userId, 
      sessionId: currentSessionId, 
      isActive: true 
    });
    
    if (!conversation) {
      conversation = new Conversation({
        userId,
        sessionId: currentSessionId,
        title: 'New Conversation',
        messages: []
      });
    }

    // Add user message to conversation
    await conversation.addMessage('user', message);

    // Build conversation context from database
    let prompt = message;
    const dbHistory = conversation.getHistory(10); // Get last 10 messages from DB
    
    if (dbHistory.length > 1) { // More than just the current message
      const context = dbHistory
        .slice(0, -1) // Exclude the current message we just added
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n');
      prompt = `Previous conversation:\n${context}\n\nUser: ${message}`;
    }

    // Generate response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Add AI response to conversation
    await conversation.addMessage('assistant', text);

    const responseTime = Date.now() - startTime;

    // Update analytics
    if (database.isConnected()) {
      await Analytics.updateDailyStats(2, responseTime, hasError); // 2 messages: user + assistant
    }

    res.json({
      success: true,
      response: text,
      sessionId: currentSessionId,
      timestamp: new Date().toISOString(),
      responseTime: responseTime
    });

  } catch (error) {
    hasError = true;
    const responseTime = Date.now() - startTime;
    
    console.error('Error generating response:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.status,
      statusText: error.statusText,
      stack: error.stack
    });

    // Update analytics with error
    if (database.isConnected()) {
      await Analytics.updateDailyStats(1, responseTime, hasError);
    }
    
    // Handle specific API errors
    if (error.message.includes('API key') || error.message.includes('API_KEY')) {
      return res.status(401).json({
        error: 'Invalid API key. Please check your Gemini API configuration.'
      });
    }

    if (error.message.includes('quota') || error.message.includes('QUOTA')) {
      return res.status(429).json({
        error: 'API quota exceeded. Please try again later.'
      });
    }

    if (error.message.includes('PERMISSION_DENIED')) {
      return res.status(403).json({
        error: 'API key does not have permission to access Gemini API.'
      });
    }

    if (error.message.includes('INVALID_ARGUMENT')) {
      return res.status(400).json({
        error: 'Invalid request format. Please try a different message.'
      });
    }

    // Return more specific error information
    res.status(500).json({
      error: `API Error: ${error.message || 'An error occurred while processing your request. Please try again.'}`
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found'
  });
});

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await database.connect();
    
    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 AI Chatbot Backend running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
      console.log(`💬 Chat endpoint: http://localhost:${PORT}/api/chat`);
      console.log(`📋 Conversations: http://localhost:${PORT}/api/conversations`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
