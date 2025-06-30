# AI Chatbot with Gemini API

A modern, responsive AI chatbot application built with React.js frontend and Node.js + Express.js backend, powered by Google's Gemini AI API.

## 🚀 Features

- **Modern UI/UX**: Clean, responsive design with Tailwind CSS
- **Real-time Chat**: Instant messaging with typing indicators
- **AI-Powered**: Integration with Google's Gemini AI API
- **Conversation Context**: Maintains conversation history for better responses
- **Error Handling**: Robust error handling and connection status indicators
- **Security**: Rate limiting, CORS protection, and security headers
- **Mobile Responsive**: Works seamlessly on all device sizes

## 🛠️ Tech Stack

### Frontend
- React.js 18
- Tailwind CSS
- Lucide React (Icons)
- React Markdown
- Axios

### Backend
- Node.js
- Express.js
- Google Generative AI SDK
- CORS
- Helmet (Security)
- Express Rate Limit

## 📋 Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v16 or higher)
- npm or yarn package manager
- Google AI Studio API key

## 🔧 Installation & Setup

### 1. Clone or Setup the Project

```bash
# If cloning from repository
git clone <repository-url>
cd ai-chatbot

# Or create the project structure as provided
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

### 4. Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key and paste it in your backend `.env` file

## 🚀 Running the Application

### Start the Backend Server

```bash
cd backend
npm run dev
```

The backend will start on `http://localhost:5000`

### Start the Frontend Development Server

```bash
cd frontend
npm start
```

The frontend will start on `http://localhost:3000`

## 📁 Project Structure

```
ai-chatbot/
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── .env
│   └── README.md
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatBot.js
│   │   │   ├── ChatInput.js
│   │   │   ├── Message.js
│   │   │   └── TypingIndicator.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .env
└── README.md
```

## 🔌 API Endpoints

### Backend API

- `GET /api/health` - Health check endpoint
- `POST /api/chat` - Send message to AI chatbot

### Example API Usage

```javascript
// Send a message
const response = await fetch('http://localhost:5000/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: 'Hello, how are you?',
    conversationHistory: []
  }),
});

const data = await response.json();
console.log(data.response);
```

## 🎨 Customization

### Styling
- Modify `tailwind.config.js` to customize colors, fonts, and spacing
- Update `src/index.css` for custom styles and animations
- Edit component styles in individual component files

### AI Behavior
- Modify the prompt construction in `backend/server.js`
- Adjust conversation history length (currently set to last 10 messages)
- Customize system prompts and personality

### Features
- Add user authentication
- Implement message persistence
- Add file upload functionality
- Include voice input/output

## 🛡️ Security Features

- Rate limiting (100 requests per 15 minutes per IP)
- CORS protection
- Helmet security headers
- Input validation and sanitization
- Error message sanitization

## 🚨 Troubleshooting

### Common Issues

1. **"API key not found" error**
   - Ensure you've set the `GEMINI_API_KEY` in your backend `.env` file
   - Verify the API key is valid and has proper permissions

2. **"Cannot connect to backend" message**
   - Make sure the backend server is running on port 5000
   - Check if there are any CORS issues in the browser console

3. **Styling not loading properly**
   - Ensure Tailwind CSS is properly installed and configured
   - Check if PostCSS is processing the styles correctly

4. **Messages not sending**
   - Check the browser network tab for API call errors
   - Verify the frontend API URL in `.env` matches your backend URL

### Environment Variables

Make sure all required environment variables are set:

**Backend (.env):**
```env
GEMINI_API_KEY=your_api_key
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

**Frontend (.env):**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Google for the Gemini AI API
- React.js community
- Tailwind CSS team
- All open-source contributors

## 📞 Support

If you encounter any issues or have questions, please:

1. Check the troubleshooting section above
2. Look for existing issues in the project repository
3. Create a new issue with detailed information about your problem

---

**Happy Coding! 🎉**
