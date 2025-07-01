# 🚀 Quick Deployment Checklist

## Before You Start
- [ ] GitHub repository is up to date
- [ ] Both backend and frontend run locally
- [ ] Clerk authentication is working locally
- [ ] MongoDB Atlas database is accessible

## Backend Deployment (Render) - Do This First!

### 1. Create Render Account
- [ ] Go to [render.com](https://render.com)
- [ ] Sign up/Login with GitHub

### 2. Create Web Service
- [ ] Click "New +" → "Web Service"
- [ ] Connect GitHub repository: `psolanki13/AI-Chatbot`
- [ ] **CRITICAL SETTINGS**:
  - **Environment**: Select `Node` (NOT Auto-detect)
  - **Root Directory**: `backend` (no dot-slash needed)
  - **Build Command**: `npm install`
  - **Start Command**: `npm start`
  - **Branch**: `master`

### 🔧 **If You Get "No such file or directory" Error:**

**SOLUTION**: Use these EXACT settings in Render:

1. **Root Directory**: `backend` (try this first)
2. **Build Command**: `npm install` 
3. **Start Command**: `npm start`
4. **Environment**: `Node`

**If that still fails, try:**
1. **Root Directory**: Leave completely **BLANK** (empty)
2. **Build Command**: `npm install --prefix backend`
3. **Start Command**: `npm start --prefix backend`

**Alternative Method (Most Reliable):**
1. **Root Directory**: Leave **BLANK**
2. **Build Command**: `ls -la && cd backend && npm install`
3. **Start Command**: `cd backend && node server.js`

### Alternative Method (If Above Fails):
1. Set Root Directory to blank (empty)
2. Set Build Command to: `cd backend && npm install`
3. Set Start Command to: `cd backend && npm start`

### 3. Add Environment Variables
**CRITICAL**: Copy these EXACTLY (no extra spaces or quotes):

```properties
GEMINI_API_KEY=AIzaSyAbivyoTcrxiwwQAkO3v_hO75Bmz-2G5qw
MONGODB_URI=mongodb+srv://test-ai:5S9WBNswazCLc4Yn@cluster0.wel7hwp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
CLERK_SECRET_KEY=sk_test_Z7epXwmA4u3GFTtDUgEd5rlXy2VoB4ri5rth8izHOE
CLERK_PUBLISHABLE_KEY=pk_test_cmlnaHQtc2VhZ3VsbC04MC5jbGVyay5hY2NvdW50cy5kZXYk
NODE_ENV=production
PORT=5000
CORS_ORIGIN=*
```

**⚠️ IMPORTANT NOTES:**
- Add each variable separately using "Add Environment Variable" button
- Do NOT include quotes around values
- Do NOT add extra spaces
- Make sure there's no trailing spaces after the values
- Click "Save Changes" after adding all variables

### 4. Deploy & Get URL
- [ ] Click "Create Web Service"
- [ ] Wait for deployment (5-10 minutes)
- [ ] **COPY YOUR BACKEND URL** (something like: `https://ai-chatbot-backend-xyz.onrender.com`)

---

## Frontend Deployment (Vercel) - Do This Second!

### 1. Create Vercel Account
- [ ] Go to [vercel.com](https://vercel.com)
- [ ] Sign up/Login with GitHub

### 2. Create Project
- [ ] Click "New Project"
- [ ] Import: `psolanki13/AI-Chatbot`
- [ ] Set Framework: `Create React App`
- [ ] Set Root Directory: `frontend`

### 3. Add Environment Variables
**IMPORTANT**: Replace `YOUR_BACKEND_URL` with your actual Render URL from step above!
```
REACT_APP_API_URL=https://YOUR_BACKEND_URL/api
REACT_APP_CLERK_PUBLISHABLE_KEY=pk_test_cmlnaHQtc2VhZ3VsbC04MC5jbGVyay5hY2NvdW50cy5kZXYk
GENERATE_SOURCEMAP=false
```

### 4. Deploy & Get URL
- [ ] Click "Deploy"
- [ ] Wait for deployment (3-5 minutes)
- [ ] **COPY YOUR FRONTEND URL** (something like: `https://ai-chatbot-xyz.vercel.app`)

---

## Final Configuration

### 1. Update Backend CORS
- [ ] Go back to Render dashboard → Your service → Environment
- [ ] Update `CORS_ORIGIN` to your Vercel URL:
  ```
  CORS_ORIGIN=https://your-vercel-url.vercel.app
  ```
- [ ] Save (this will redeploy)

### 2. Update Clerk Dashboard
- [ ] Go to [Clerk Dashboard](https://dashboard.clerk.com)
- [ ] Add your Vercel URL to allowed domains
- [ ] Update redirect URLs to point to your Vercel app

---

## Test Your Deployment
- [ ] Visit your Vercel URL
- [ ] Sign up for a test account
- [ ] Test the chat functionality
- [ ] Check conversation history

## 🎉 You're Done!
Your AI Chatbot is now live in production!
