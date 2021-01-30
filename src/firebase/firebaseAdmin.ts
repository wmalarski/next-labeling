import * as dotenv from "dotenv";
import * as firebaseAdmin from "firebase-admin";

dotenv.config();

if (!firebaseAdmin.apps.length) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey ? privateKey.replace(/\\n/g, "\n") : undefined,
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

export { firebaseAdmin };
