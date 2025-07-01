import React from 'react';
import { SignIn } from '@clerk/clerk-react';

const SignInPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to AI Chatbot
          </h1>
          <p className="text-gray-600">
            Sign in to access your personalized AI assistant
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <SignIn 
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "shadow-none border-none"
              }
            }}
            redirectUrl="/dashboard"
          />
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
