# Deployment Guide - AI Chatbot with Clerk Authentication

## 🎯 Overview
This guide will help you deploy your AI Chatbot with Clerk authentication to production:
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: MongoDB Atlas (already configured)
- **Authentication**: Clerk (already configured)

## 📋 Prerequisites
- ✅ GitHub repository with your code
- ✅ Vercel account (free tier available)
- ✅ Render account (free tier available)
- ✅ Clerk account with authentication keys
- ✅ MongoDB Atlas database running

---

## 🚀 **Phase 1: Deploy Backend to Render**

### Step 1: Create Render Web Service
1. Go to [render.com](https://render.com) and sign in
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account and select repository: `psolanki13/AI-Chatbot`
4. Configure the service:
   - **Name**: `ai-chatbot-backend`
   - **Environment**: `Node`
   - **Region**: Choose closest to your location
   - **Branch**: `master`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### Step 2: Add Environment Variables in Render
In the **Environment** tab, add these variables:

```properties
NODE_ENV=production
PORT=5000
GEMINI_API_KEY=AIzaSyAbivyoTcrxiwwQAkO3v_hO75Bmz-2G5qw
MONGODB_URI=mongodb+srv://test-ai:5S9WBNswazCLc4Yn@cluster0.wel7hwp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
CLERK_SECRET_KEY=sk_test_Z7epXwmA4u3GFTtDUgEd5rlXy2VoB4ri5rth8izHOE
CLERK_PUBLISHABLE_KEY=pk_test_cmlnaHQtc2VhZ3VsbC04MC5jbGVyay5hY2NvdW50cy5kZXYk
CORS_ORIGIN=*
```

### Step 3: Deploy Backend
1. Click **"Create Web Service"**
2. Wait for deployment to complete (5-10 minutes)
3. **Copy your backend URL** (e.g., `https://ai-chatbot-backend-xyz.onrender.com`)

---

## 🌐 **Phase 2: Deploy Frontend to Vercel**

### Step 1: Create Vercel Project
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"New Project"**
3. Import your GitHub repository: `psolanki13/AI-Chatbot`
4. Configure the project:
   - **Framework Preset**: `Create React App`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `build` (default)

### Step 2: Add Environment Variables in Vercel
In the **Environment Variables** section, add:

```properties
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
REACT_APP_CLERK_PUBLISHABLE_KEY=pk_test_cmlnaHQtc2VhZ3VsbC04MC5jbGVyay5hY2NvdW50cy5kZXYk
GENERATE_SOURCEMAP=false
```

**⚠️ Important**: Replace `your-backend-url.onrender.com` with your actual Render backend URL from Phase 1.

### Step 3: Deploy Frontend
1. Click **"Deploy"**
2. Wait for deployment to complete (3-5 minutes)
3. **Copy your frontend URL** (e.g., `https://ai-chatbot-frontend-xyz.vercel.app`)

---

## 🔧 **Phase 3: Update CORS Configuration**

### Step 1: Update Backend CORS
1. Go back to your **Render dashboard**
2. Navigate to your backend service → **Environment**
3. Update the `CORS_ORIGIN` variable:
   ```
   CORS_ORIGIN=https://your-vercel-url.vercel.app
   ```
4. Click **"Save Changes"** (this will redeploy)

### Step 2: Update Clerk Dashboard
1. Go to your [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Go to **Domains**
4. Add your production domain: `https://your-vercel-url.vercel.app`
5. Update **Paths**:
   - After sign-in URL: `https://your-vercel-url.vercel.app/dashboard`
   - After sign-up URL: `https://your-vercel-url.vercel.app/dashboard`

---

## ✅ **Phase 4: Test Production Deployment**

### Test Backend
```bash
# Test health endpoint
curl https://your-backend-url.onrender.com/api/health

# Should return: {"status":"OK","message":"AI Chatbot Backend is running",...}
```

### Test Frontend
1. Visit your Vercel URL
2. You should see the sign-in page
3. Create a test account
4. Test the chat functionality
5. Verify conversation history

---

## 🛠 **Troubleshooting**

### Common Issues:

1. **CORS Errors**
   - Check `CORS_ORIGIN` in Render backend environment
   - Ensure it matches your Vercel frontend URL exactly

2. **"Failed to fetch" Errors**
   - Verify `REACT_APP_API_URL` in Vercel environment
   - Check that backend is running (visit health endpoint)

3. **Authentication Errors**
   - Verify Clerk keys are correct in both platforms
   - Check Clerk Dashboard domain configuration

4. **Database Connection Errors**
   - Verify MongoDB Atlas connection string
   - Check IP whitelist (should allow all IPs: `0.0.0.0/0`)

5. **Build Failures**
   - Check build logs in respective platforms
   - Verify all dependencies are in `package.json`

### Debug Commands:
```bash
# Check backend health
curl https://your-backend-url.onrender.com/api/health

# Check frontend (should redirect to auth)
curl -I https://your-frontend-url.vercel.app
```

---

## 📊 **Monitoring & Maintenance**

### Free Tier Limitations:
- **Render**: 750 hours/month, spins down after 15 minutes of inactivity
- **Vercel**: 100GB bandwidth/month, unlimited deployments
- **MongoDB Atlas**: 512MB storage
- **Clerk**: 10,000 MAU (Monthly Active Users)

### Performance Tips:
- Render free tier has cold starts (30+ seconds to wake up)
- Consider upgrading to paid plans for production use
- Monitor usage in respective dashboards

---

## 🔐 **Security Checklist**
- ✅ Environment variables are set (not hardcoded)
- ✅ CORS is configured for specific origins
- ✅ Clerk authentication is properly configured
- ✅ Database connection is secured
- ✅ API keys are not exposed in frontend code

---

## 📈 **Next Steps After Deployment**
1. Set up custom domains (optional, requires paid plans)
2. Configure monitoring and alerts
3. Set up CI/CD pipelines for automatic deployments
4. Add error tracking (e.g., Sentry)
5. Implement analytics and user feedback

**Your AI Chatbot is now ready for production! 🎉**

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
