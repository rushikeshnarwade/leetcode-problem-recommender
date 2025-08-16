# 🎯 LeetCode Problem Recommender

A personalized LeetCode problem recommendation system that helps users discover problems based on their skill level, solved problems, and preferences. Built with Next.js, Firebase, and integrated with LeetCode and Zerotrac APIs.

![LeetCode Recommender](https://img.shields.io/badge/LeetCode-Recommender-orange)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Firebase](https://img.shields.io/badge/Firebase-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-blue)

## 📸 Screenshots

*Add screenshots of the application here.*

## ✨ Features

### 🎛️ **Smart Problem Filtering**
- **Rating-based Recommendations**: Problems filtered by user rating ±50 (customizable)
- **Difficulty Filters**: Easy, Medium, Hard, or All
- **Solved Status Filters**: View only solved, unsolved, or all problems
- **Real-time Updates**: Instant filtering as you adjust preferences

### 📊 **LeetCode Integration**
- **Username Sync**: Connect your LeetCode profile
- **Auto-sync Solved Problems**: Fetch your actual progress from LeetCode
- **Progress Tracking**: Visual indicators for solved/unsolved problems
- **Manual Toggle**: Mark problems as solved/unsolved directly

### 🏠 **Personalized Homepage**
- **Curated Sections**: Daily Challenge, Weekly Focus, Challenge Zone
- **Custom Filters**: Adjustable rating range and difficulty preferences
- **Interactive Problem Cards**: One-click solved/unsolved toggle
- **Progress Visualization**: Track your solving journey

### 👤 **User Profile Management**
- **Rating Management**: Set and update your competitive programming rating
- **LeetCode Username**: Link your LeetCode profile for automatic sync
- **Progress Statistics**: View solved problem counts and activity
- **Settings**: Customize app preferences and account security

## 💻 Tech Stack

*   **Frontend:** Next.js, React, TypeScript, Tailwind CSS
*   **Backend:** Firebase (Authentication, Firestore, Cloud Functions)
*   **APIs:** LeetCode API, Zerotrac API

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Firebase CLI
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/leetcode-problem-recommender.git
cd leetcode-problem-recommender
```

### 2. Setup Backend (Firebase)
```bash
# Install Firebase tools
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase
firebase init

# Start Firebase emulators
firebase emulators:start
```

### 3. Setup Frontend (Next.js)
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Initialize Data

To sync the problems from LeetCode and ratings from Zerotrac, you need to run the following commands in a separate terminal:

```bash
# Sync LeetCode problems
curl http://127.0.0.1:5001/leetcode-problem-recommeder/us-central1/syncLeetcodeProblemsHttp

# Sync Zerotrac ratings
curl http://127.0.0.1:5001/leetcode-problem-recommeder/us-central1/syncZerotracRatingsHttp
```

### 5. Access Application
- **Frontend**: http://localhost:3000
- **Firebase Emulator UI**: http://127.0.0.1:4000

## 🔧 Configuration

### Firebase Setup
1.  Create a new project on the [Firebase Console](https://console.firebase.google.com/).
2.  Add a web app to your project.
3.  Copy the Firebase config object from your project settings.
4.  Replace the placeholder config in `frontend/src/lib/firebase.ts` with your project's config.

### Environment Variables
Create a `.env.local` file in the `frontend` directory and add your Firebase project configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-auth-domain"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-messaging-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
```

## 📊 Data Flow

1. **Problem Sync**: Cloud Functions fetch problems from LeetCode and ratings from Zerotrac
2. **User Authentication**: Firebase Auth manages user sessions
3. **Profile Sync**: Users connect LeetCode profiles to import solved problems
4. **Filtering**: Frontend applies user preferences to recommend relevant problems
5. **Progress Tracking**: User actions update Firestore and refresh recommendations

## 🎨 Key Components

### Frontend Components
- `ProblemCard`: Interactive problem display with solved toggle
- `ProblemFilters`: Advanced filtering controls
- `CuratedSection`: Personalized problem collections
- `AuthContext`: User session management

### Backend Services
- `syncLeetcode.js`: Fetches problems from LeetCode API
- `syncZerotrac.js`: Fetches problem ratings from Zerotrac
- `problemService.ts`: Advanced filtering and search logic
- `leetcodeService.ts`: User data integration with LeetCode

## 🔒 Security & Privacy

- Firebase Authentication for secure user sessions
- Firestore security rules prevent unauthorized access
- No sensitive data stored in frontend code
- User LeetCode data fetched securely through backend APIs

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy to your preferred platform
```

### Backend (Firebase)
```bash
cd firebase
firebase deploy --only functions,firestore,hosting
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **LeetCode**: For providing the problems API
- **Zerotrac**: For providing problem difficulty ratings
- **Firebase**: For backend infrastructure
- **Next.js**: For the fantastic React framework

## 📬 Contact

- GitHub: [@rushikeshnarwade](https://github.com/rushikeshnarwade)
- Email: rushikeshnarwade53@gmail.com

---

⭐ **Star this repository if you find it helpful!**

Built with ❤️ for the competitive programming community