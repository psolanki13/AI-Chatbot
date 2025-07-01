import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { 
  SignedIn, 
  SignedOut, 
  RedirectToSignIn,
  useAuth 
} from '@clerk/clerk-react';
import ChatBot from './components/ChatBot';
import SignInPage from './components/SignInPage';
import SignUpPage from './components/SignUpPage';
import Header from './components/Header';
import './index.css';

function ProtectedRoute({ children }) {
  const { isSignedIn, isLoaded } = useAuth();
  
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }
  
  return children;
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public routes */}
          <Route 
            path="/sign-in/*" 
            element={
              <SignedOut>
                <SignInPage />
              </SignedOut>
            } 
          />
          <Route 
            path="/sign-up/*" 
            element={
              <SignedOut>
                <SignUpPage />
              </SignedOut>
            } 
          />
          
          {/* Protected routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gray-50">
                  <Header />
                  <ChatBot />
                </div>
              </ProtectedRoute>
            } 
          />
          
          {/* Default route */}
          <Route 
            path="/" 
            element={
              <>
                <SignedIn>
                  <Navigate to="/dashboard" replace />
                </SignedIn>
                <SignedOut>
                  <Navigate to="/sign-in" replace />
                </SignedOut>
              </>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
