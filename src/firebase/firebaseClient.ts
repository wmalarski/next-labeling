import * as dotenv from "dotenv";
import firebaseClient from "firebase/app";
import "firebase/auth";

dotenv.config();

const CLIENT_CONFIG = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

export function initializeFirebase(): void {
  if (!firebaseClient.apps.length) {
    firebaseClient.initializeApp(CLIENT_CONFIG);
    firebaseClient
      .auth()
      .setPersistence(firebaseClient.auth.Auth.Persistence.SESSION);
    (window as any).firebase = firebaseClient;
  }
}

initializeFirebase();

export { firebaseClient };
