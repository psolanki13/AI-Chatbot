# AI Chatbot Backend

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   PORT=5000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   ```

3. Get your Gemini API key:
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy and paste it in your `.env` file

4. Run the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/chat` - Chat with AI

## Features

- ✅ Gemini AI integration
- ✅ Rate limiting
- ✅ CORS configuration
- ✅ Security headers
- ✅ Error handling
- ✅ Conversation history support
