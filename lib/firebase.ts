
import { initializeApp, getApps, getApp, FirebaseOptions } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

// In Next.js, we don't need to use dotenv.config() as Next.js loads .env files automatically
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Validate Firebase configuration
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required Firebase environment variables: ${missingEnvVars.join(', ')}\n` +
    'Please add them to your .env.local file'
  );
}

let app: any;
let db: Firestore | any;

try {
  // Check if all required config values are present
  const missingValues = Object.entries(firebaseConfig)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingValues.length > 0) {
    throw new Error(`Missing Firebase configuration values: ${missingValues.join(', ')}`);
  }

  // Initialize Firebase
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  db = getFirestore(app);
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw new Error(
    'Failed to initialize Firebase. Please check your configuration and try again.'
  );
}

export { app, db };
