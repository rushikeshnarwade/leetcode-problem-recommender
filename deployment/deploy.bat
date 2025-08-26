@echo off
echo 🚀 Building and deploying LeetCode Problem Recommender...

echo.
echo 📁 Switching to app directory...
cd /d "%~dp0..\app"

echo.
echo 📦 Installing dependencies...
call npm install

echo.
echo 🧹 Cleaning previous build...
call npm run clean

echo.
echo 🔨 Building project...
call npm run build

if %errorlevel% neq 0 (
    echo ❌ Build failed! Please check the errors above.
    pause
    exit /b 1
)

echo.
echo 📁 Switching to deployment directory...
cd /d "%~dp0"

echo.
echo 📂 Copying build files...
xcopy /s /e /y "..\app\build\*" ".\build\"

echo.
echo 🌐 Deploying to Firebase...
call firebase deploy --only hosting

if %errorlevel% neq 0 (
    echo ❌ Deployment failed! Please check the errors above.
    pause
    exit /b 1
)

echo.
echo ✅ Deployment successful!
echo 🎉 Your app is now live on Firebase!
echo.

pause