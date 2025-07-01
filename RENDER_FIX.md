# Render Deployment Fix

## If you're still getting the root directory error, try this:

### Method 1: Use Build/Start Commands with cd
- Root Directory: (leave blank)
- Build Command: `cd backend && npm install`
- Start Command: `cd backend && npm start`

### Method 2: Use render.yaml
1. Delete the web service from Render dashboard
2. Add this render.yaml to your ROOT directory (not backend):

```yaml
services:
  - type: web
    name: ai-chatbot-backend
    env: node
    plan: free
    rootDir: backend
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
```

3. Push to GitHub
4. Create new web service and select "use render.yaml"

### Method 3: Monorepo Structure
Create a new web service with these exact settings:
- Repository: psolanki13/AI-Chatbot
- Branch: master
- Root Directory: backend
- Environment: Node
- Build Command: npm ci
- Start Command: node server.js
