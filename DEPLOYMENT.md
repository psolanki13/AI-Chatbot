# Deployment Guide

## Frontend Deployment (Vercel)

### Prerequisites
- GitHub account
- Vercel account (free tier available)

### Steps:

1. **Push your code to GitHub** (already done)

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Select your `AI-Chatbot` repository
   - Configure project:
     - Framework Preset: `Create React App`
     - Root Directory: `frontend`
     - Build Command: `npm run build`
     - Output Directory: `build`
   - Add Environment Variables:
     - `REACT_APP_API_URL`: (leave empty for now, will update after backend deployment)
   - Click "Deploy"

3. **Get your Vercel URL** (e.g., `https://your-app-name.vercel.app`)

## Backend Deployment (Render)

### Prerequisites
- GitHub account
- Render account (free tier available)

### Steps:

1. **Deploy to Render:**
   - Go to [render.com](https://render.com)
   - Sign in with GitHub
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure service:
     - Name: `ai-chatbot-backend`
     - Environment: `Node`
     - Region: Choose closest to you
     - Branch: `master`
     - Root Directory: `backend`
     - Build Command: `npm install`
     - Start Command: `npm start`

2. **Set Environment Variables in Render:**
   - Go to Environment tab
   - Add these variables:
     ```
     NODE_ENV=production
     PORT=5000
     GEMINI_API_KEY=AIzaSyAbivyoTcrxiwwQAkO3v_hO75Bmz-2G5qw
     MONGODB_URI=mongodb+srv://test-ai:5S9WBNswazCLc4Yn@cluster0.wel7hwp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
     CORS_ORIGIN=https://your-vercel-url.vercel.app
     ```

3. **Deploy the service**

4. **Get your Render URL** (e.g., `https://your-app-name.onrender.com`)

## Post-Deployment Configuration

### Update Frontend API URL:
1. Go to Vercel dashboard
2. Navigate to your project → Settings → Environment Variables
3. Add/Update: `REACT_APP_API_URL=https://your-render-url.onrender.com/api`
4. Redeploy the frontend

### Update Backend CORS:
1. Go to Render dashboard
2. Navigate to your service → Environment
3. Update: `CORS_ORIGIN=https://your-vercel-url.vercel.app`
4. Redeploy the backend

## Testing Deployment

1. Visit your Vercel URL
2. Test chat functionality
3. Check conversation history
4. Verify database persistence

## Troubleshooting

### Common Issues:
- **CORS errors**: Check CORS_ORIGIN in backend environment
- **API connection failed**: Verify REACT_APP_API_URL in frontend
- **Database connection**: Check MongoDB Atlas IP whitelist (should allow all IPs: 0.0.0.0/0)
- **Build failures**: Check logs in respective platforms

### Useful Commands:
```bash
# Test backend health locally
curl https://your-render-url.onrender.com/api/health

# Check frontend API connection
# Open browser dev tools → Network tab while using the app
```

## Notes:
- Render free tier may have cold starts (takes 30+ seconds to wake up)
- Vercel automatically handles HTTPS
- Both platforms support custom domains (paid plans)
- Monitor usage to stay within free tier limits
