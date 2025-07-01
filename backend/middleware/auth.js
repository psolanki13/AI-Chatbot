const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

// Middleware to verify Clerk authentication
const requireAuth = ClerkExpressRequireAuth({
  // Optional: customize error handling
  onError: (error) => {
    console.error('Clerk auth error:', error);
    return {
      status: 401,
      message: 'Unauthorized: Please sign in to continue'
    };
  }
});

// Middleware to extract user information from Clerk
const extractUser = async (req, res, next) => {
  try {
    if (req.auth && req.auth.userId) {
      // User is authenticated
      req.userId = req.auth.userId;
      req.userEmail = req.auth.sessionClaims?.email;
      req.userName = `${req.auth.sessionClaims?.firstName || ''} ${req.auth.sessionClaims?.lastName || ''}`.trim();
    }
    next();
  } catch (error) {
    console.error('Error extracting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Optional middleware for routes that can work with or without auth
const optionalAuth = async (req, res, next) => {
  try {
    // Try to get auth info but don't require it
    if (req.headers.authorization) {
      // If authorization header exists, try to verify
      await requireAuth(req, res, (err) => {
        if (!err) {
          extractUser(req, res, next);
        } else {
          // Auth failed, but continue without user
          next();
        }
      });
    } else {
      // No auth header, continue without user
      next();
    }
  } catch (error) {
    // Continue without auth on error
    next();
  }
};

module.exports = {
  requireAuth,
  extractUser,
  optionalAuth
};
