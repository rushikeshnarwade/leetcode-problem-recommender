# LeetCode Problem Recommender - Frontend

A Next.js web application that provides personalized LeetCode problem recommendations based on user skill level and solved problems.

## Features

### User Application
- **Homepage**: Curated problem sections with personalized recommendations
- **User Profile**: Manage user data, rating, and view progress statistics
- **Settings**: Configure app preferences, notifications, and account security
- **Authentication**: Firebase Auth with email/password login and registration

### Problem Filtering
- Problems filtered by user rating ±50 range
- Excludes already solved problems
- Integrates LeetCode and Zerotrac rating data
- Difficulty-based categorization (Easy, Medium, Hard)

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **State Management**: React Context API

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── login/             # Authentication page
│   │   ├── profile/           # User profile page
│   │   ├── settings/          # Settings page
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Homepage
│   ├── components/            # Reusable components
│   │   ├── Navbar.tsx         # Navigation component
│   │   ├── ProblemCard.tsx    # Problem display card
│   │   └── CuratedSection.tsx # Curated problems section
│   ├── contexts/             # React contexts
│   │   └── AuthContext.tsx   # Authentication context
│   ├── lib/                  # Utilities and services
│   │   ├── firebase.ts       # Firebase configuration
│   │   └── problemService.ts # Problem data service
│   └── types/                # TypeScript type definitions
│       └── index.ts          # Shared interfaces
├── package.json
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Firebase project configured (see backend setup)
- Firebase emulator suite running

### Installation

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   Update `src/lib/firebase.ts` with your Firebase project configuration:
   ```typescript
   const firebaseConfig = {
     projectId: 'your-project-id',
     authDomain: 'your-project.firebaseapp.com',
     storageBucket: 'your-project.appspot.com',
     messagingSenderId: 'your-sender-id',
     appId: 'your-app-id'
   };
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

### Firebase Emulator Setup

Make sure Firebase emulators are running from the `firebase` directory:
```bash
cd ../firebase
firebase emulators:start
```

The frontend will connect to:
- Firestore Emulator: localhost:8080
- Auth Emulator: localhost:9099

## Key Components

### Authentication Flow
1. Users can register/login via `/login`
2. User document created in Firestore with default rating (1200)
3. Authentication state managed through AuthContext
4. Protected routes redirect to login if not authenticated

### Problem Recommendation
- **Homepage**: Shows curated problems and filtered recommendations
- **Filtering Logic**: `userRating - 50 <= problemRating <= userRating + 50`
- **Data Source**: Combines LeetCode and Zerotrac data from Firestore
- **Curation**: Different sections (Daily Challenge, Weekly Focus, Challenge Zone)

### User Management
- **Profile Page**: Edit display name, rating, view statistics
- **Settings Page**: App preferences, email/password updates
- **Progress Tracking**: Shows solved problems count and difficulty breakdown

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Integration with Backend

The frontend integrates with the Firebase backend:
- **Problems Collection**: Fetches problem data synced by Cloud Functions
- **Users Collection**: Stores user profiles and preferences
- **UserSettings Collection**: Manages user app preferences
- **Real-time Updates**: Uses Firestore real-time listeners where needed

## Next Steps

1. **Admin Application**: Create admin interface for managing problems and users
2. **Enhanced Filtering**: Add topic-based filtering and search
3. **Progress Tracking**: Implement detailed progress analytics
4. **Notifications**: Add push notifications for daily challenges
5. **Mobile App**: Consider Flutter mobile application

## Environment Variables

Create `.env.local` for additional configuration:
```
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
# Add other Firebase config as needed
```