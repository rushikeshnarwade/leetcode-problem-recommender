# 🎯 LeetCode Problem Recommender

An intelligent problem recommendation system that helps developers practice coding problems efficiently with personalized suggestions, comprehensive filtering, and progress tracking. Features a complete database of 3,662+ LeetCode problems with client-side filtering for blazing-fast performance.

![LeetCode Recommender](https://img.shields.io/badge/LeetCode-Recommender-orange)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-blue)
![Problems](https://img.shields.io/badge/Problems-3662+-brightgreen)

## 🚀 **Live Demo**

**🌐 [https://leetcode-problem-recommeder.web.app](https://leetcode-problem-recommeder.web.app)**

## ✨ Features

### 🎯 **Smart Problem Discovery**
- **3,662+ Problems**: Complete LeetCode database with real-time API updates
- **72+ Tags**: Comprehensive filtering by Array, Dynamic Programming, Graph Theory, etc.
- **Advanced Search**: Find problems by title, tags, or keywords instantly
- **Intelligent Filtering**: Rating ranges, difficulty levels, and solved status
- **Client-Side Performance**: No backend queries - instant results

### 🔍 **Powerful Filtering System**
- **Tag-Based Filtering**: Select multiple tags for precise problem discovery  
- **Smart Search Bar**: Real-time search across titles and tags
- **Rating-Based Recommendations**: Customizable difficulty ranges
- **Solved Status Tracking**: Filter by solved/unsolved problems
- **Mobile-Optimized Interface**: Perfect experience on all devices

### 🎨 **Modern User Experience**
- **Balanced Dark Theme**: Reduced eye strain with professional aesthetics
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Touch-Friendly**: 44px+ touch targets for mobile accessibility
- **Fast Performance**: Client-side filtering for instant results
- **Clean Interface**: Minimal, developer-focused design

### 🔗 **LeetCode Integration** 
- **Direct Problem Links**: One-click access to solve problems on LeetCode
- **Real Data**: Authentic acceptance rates, difficulty levels, and tags
- **Progress Tracking**: Mark problems as solved locally
- **Profile Sync**: Optional LeetCode account integration

## 💻 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Data**: Local JSON database (3,662+ problems)
- **Authentication**: Firebase Auth (optional)
- **Deployment**: Firebase Hosting
- **APIs**: LeetCode GraphQL API for data fetching

## 📁 Project Structure

```
leetcode/
├── app/                    # Next.js application
│   ├── src/
│   │   ├── app/           # Next.js app directory (pages)
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts
│   │   ├── data/          # Problems database (3,662+ problems)
│   │   ├── lib/           # Utilities & services
│   │   └── types/         # TypeScript definitions
│   ├── package.json       # Dependencies
│   └── tailwind.config.ts # Tailwind configuration
├── deployment/             # Deployment configuration
│   ├── firebase.json      # Firebase hosting config
│   └── deploy.bat         # Deployment script
├── scripts/               # Utility scripts
│   ├── fetch-all-problems.js  # LeetCode API fetcher
│   └── package.json       # Scripts dependencies
├── docs/                  # Documentation
└── README.md             # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/rushikeshnarwade/leetcode-problem-recommender.git
cd leetcode-problem-recommender
```

### 2. Install Dependencies
```bash
# Navigate to app directory
cd app

# Install dependencies
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Access Application
- **Local Development**: http://localhost:3000
- **Live Demo**: https://leetcode-problem-recommeder.web.app

## 🔄 Update Problems Database

The problems database can be updated with the latest LeetCode problems:

```bash
# Navigate to scripts directory
cd scripts

# Install script dependencies
npm install

# Fetch all problems from LeetCode API
node fetch-all-problems.js
```

This will update `app/src/data/problems.json` with the latest problems, tags, and metadata.

## 🔧 Configuration

### Firebase Setup (Optional)
Firebase is only needed for user authentication. The app works fully without it.

1. Create a new project on the [Firebase Console](https://console.firebase.google.com/)
2. Add a web app to your project
3. Copy the Firebase config object from your project settings
4. Create `.env.local` file in `app` directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-auth-domain"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-messaging-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
```

## 📊 Architecture

### Data Flow
1. **Problems Database**: 3,662+ problems stored locally in JSON format
2. **Client-Side Filtering**: All filtering happens in the browser for instant results  
3. **Search & Tags**: Real-time search across titles and 72+ tag categories
4. **Progress Tracking**: Local storage for solved problems (Firebase optional)
5. **LeetCode Integration**: Direct links to problems on LeetCode platform

### Key Features
- **No Backend Dependencies**: Works completely offline after initial load
- **Fast Performance**: Client-side filtering for instant results
- **Mobile Optimized**: Responsive design with touch-friendly interface
- **Comprehensive Database**: All LeetCode problems with authentic metadata

## 🎨 Key Components

### Core Components
- **`ProblemCard`**: Interactive problem display with tags and solved toggle
- **`ProblemFilters`**: Advanced filtering with search, tags, and preferences  
- **`CuratedSection`**: Personalized problem recommendations
- **`AuthContext`**: Optional user session management

### Services & Utilities
- **`problemService.ts`**: Client-side filtering and search logic
- **`fetch-all-problems.js`**: LeetCode API data fetcher script
- **`problems.json`**: Comprehensive problems database (3,662+ problems)

## 🚀 Deployment

### Automatic Deployment
The project includes a deployment script for Firebase Hosting:

```bash
# Navigate to deployment directory
cd deployment

# Run deployment script (Windows)
.\deploy.bat

# For manual deployment
npm run build
firebase deploy
```

### Alternative Platforms
```bash
cd app
npm run build

# Deploy to Vercel
vercel --prod

# Deploy to Netlify  
netlify deploy --prod --dir=build
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
