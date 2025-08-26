# 🚀 Deployment Guide

This guide covers deploying the LeetCode Problem Recommender with its comprehensive problems database and client-side architecture.

## 📋 Prerequisites

1. **Node.js** (v18 or later)
2. **Firebase CLI** - Install with: `npm install -g firebase-tools`
3. **Firebase Account** with a project created (optional)

## 🚀 Quick Deployment

### Automated Deployment Script
The project includes a ready-to-use deployment script:

```bash
# Navigate to deployment directory
cd deployment

# Run the deployment script (Windows)
.\deploy.bat

# For other platforms, run commands manually:
cd ../app
npm install
npm run build
firebase deploy
```

### Manual Deployment Steps

```bash
# 1. Navigate to app directory
cd app

# 2. Install dependencies
npm install

# 3. Build the application
npm run build

# 4. Deploy to Firebase Hosting
firebase deploy --only hosting
```

## 🔧 Manual Problem Data Management

Since we're not using Firebase Functions, you'll need to populate the problems database manually:

### Option 1: Firebase Console (Recommended)
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project → Firestore Database
3. Create a collection called `problems`
4. Import your problem data manually

### Option 2: Batch Import Script (Run locally)
Create a script to populate problems data:

```javascript
// populate-problems.js
const admin = require('firebase-admin');
const serviceAccount = require('./path-to-your-service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Your problems data
const problems = [
  {
    id: 1,
    title: "Two Sum",
    slug: "two-sum",
    difficulty: "easy",
    acceptanceRate: 0.49,
    isPremium: false,
    zerotracRating: 1200,
    // ... more fields
  }
  // Add more problems...
];

async function populateProblems() {
  const batch = db.batch();
  
  problems.forEach((problem) => {
    const docRef = db.collection('problems').doc(problem.slug);
    batch.set(docRef, problem);
  });
  
  await batch.commit();
  console.log('Problems data populated!');
}

populateProblems();
```

Run with: `node populate-problems.js`

## 🆓 Firebase Free Tier Usage

Your app uses only these FREE Firebase services:

- **🔥 Hosting**: 10 GB storage, 10 GB/month transfer
- **📊 Firestore**: 1 GiB storage, 50K reads/day, 20K writes/day  
- **🔐 Authentication**: Unlimited users

## 📁 Project Structure

```
frontend/
├── out/                 # Static build output (generated)
├── src/
│   ├── app/            # Next.js pages
│   ├── components/     # React components  
│   ├── lib/           # Utilities & Firebase config
│   └── types/         # TypeScript types
├── firebase.json      # Firebase hosting config
├── firestore.rules    # Database security rules
├── firestore.indexes.json # Database indexes
└── DEPLOYMENT.md      # This file
```

## 🚀 Deployment Commands

```bash
# Development server
npm run dev

# Build for production
npm run export

# Deploy to Firebase
npm run deploy

# Deploy just database rules
npm run deploy-rules

# Full deployment (recommended)
npm run export && npm run deploy
```

## 🔧 Configuration

### Firebase Config
Update `src/lib/firebase.ts` with your Firebase project config:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

### Environment Variables (Optional)
Create `.env.local` for sensitive config:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
# ... etc
```

## 🛡️ Security Features

- ✅ **Client-side only** - No server costs
- ✅ **Firestore rules** - Secure data access
- ✅ **Authentication** - Protected user data
- ✅ **Static hosting** - Fast & secure
- ✅ **No API keys exposed** - Uses public LeetCode stats API

## 📈 Performance Optimizations

- ✅ **Static generation** - Fast loading
- ✅ **Code splitting** - Optimized bundles
- ✅ **Image optimization** disabled (for static export)
- ✅ **Caching headers** - Browser caching
- ✅ **Minified assets** - Smaller downloads

## 🚨 Troubleshooting

### Build Issues
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Deployment Issues
```bash
# Check Firebase CLI version
firebase --version

# Re-login to Firebase
firebase logout
firebase login
```

### Database Issues
- Check Firestore rules in Firebase Console
- Verify indexes are deployed
- Check browser console for auth errors

## 🎉 You're Live!

Your app is now deployed on Firebase's free tier at:
`https://your-project-id.web.app`

No backend maintenance required! 🎉