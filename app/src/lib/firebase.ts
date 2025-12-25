import { initializeApp, getApps } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export const auth = getAuth(app);
export const db = getFirestore(app);

// Emulators disabled - using production Firebase
// To use emulators, uncomment the code below and run: firebase emulators:start
/*
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  try {
    if (!(auth as any)._delegate?._config?.emulator) {
      connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
    }
  } catch (error) {
    console.warn('Auth emulator connection failed:', error);
  }
  
  try {
    if (!(db as any)._delegate?._settings?.host?.includes('127.0.0.1:8080')) {
      connectFirestoreEmulator(db, '127.0.0.1', 8080);
    }
  } catch (error) {
    console.warn('Firestore emulator connection failed:', error);
  }
}
*/

export { app };