# Clerk Authentication Setup Guide

## Prerequisites
1. Create a free Clerk account at [https://clerk.com](https://clerk.com)
2. Create a new Clerk application

## Step 1: Get Clerk Keys

1. Go to your [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Go to **API Keys** section
4. Copy the following keys:
   - **Publishable Key** (starts with `pk_`)
   - **Secret Key** (starts with `sk_`)

## Step 2: Update Environment Variables

### Backend (.env file)
```properties
CLERK_SECRET_KEY=sk_test_your_secret_key_here
CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

### Frontend (.env file)
```properties
REACT_APP_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

## Step 3: Configure Clerk Application Settings

1. In your Clerk Dashboard, go to **User & Authentication** → **Email, Phone, Username**
2. Configure your sign-in methods (email is enabled by default)
3. Go to **Paths** and set:
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up` 
   - After sign-in URL: `/dashboard`
   - After sign-up URL: `/dashboard`

## Step 4: Test Authentication

1. Start your backend: `npm start` (in backend folder)
2. Start your frontend: `npm start` (in frontend folder)
3. Visit `http://localhost:3000`
4. You should be redirected to sign-in page
5. Create an account and test the chatbot

## Features Included

✅ **User Authentication**: Sign-up, sign-in, sign-out
✅ **Protected Routes**: Chat access only for authenticated users
✅ **User-specific Data**: Each user has their own conversation history
✅ **User Management**: Profile management via Clerk
✅ **Session Management**: Automatic token handling

## Production Deployment

### Vercel (Frontend)
Add environment variable:
- `REACT_APP_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key

### Render (Backend)
Add environment variables:
- `CLERK_SECRET_KEY`: Your Clerk secret key
- `CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key

## Troubleshooting

### Common Issues:

1. **"Missing Publishable Key" error**
   - Make sure `REACT_APP_CLERK_PUBLISHABLE_KEY` is set in frontend `.env`
   - Restart the frontend development server

2. **Authentication not working**
   - Check that both publishable and secret keys are correct
   - Verify the keys match the same Clerk application

3. **CORS errors**
   - Make sure your frontend URL is added to allowed origins in backend
   - Check that backend `CORS_ORIGIN` includes your frontend URL

4. **Database errors**
   - Ensure MongoDB connection string is correct
   - Check that MongoDB Atlas allows connections from your IP

## Security Notes

- Never commit secret keys to version control
- Use different Clerk applications for development and production
- Keep your secret keys secure and rotate them periodically
