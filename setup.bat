@echo off
echo =====================================
echo    AI Chatbot Setup Script
echo =====================================
echo.

echo 1. Checking if Node.js is installed...
node --version > nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js is installed

echo.
echo 2. Installing dependencies...
call npm run install-all
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo =====================================
echo     Setup Complete!
echo =====================================
echo.
echo Next steps:
echo 1. Get your Gemini API key from: https://makersuite.google.com/app/apikey
echo 2. Add it to backend\.env file (replace 'your_gemini_api_key_here')
echo 3. Run 'npm start' to start both frontend and backend
echo.
echo Useful commands:
echo - npm start           : Start both frontend and backend
echo - npm run start-backend : Start only backend server
echo - npm run start-frontend : Start only frontend development server
echo.
pause
