import * as admin from "firebase-admin";

export const verifyIdToken = (
  token: string,
): Promise<admin.auth.DecodedIdToken> => {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey ? privateKey.replace(/\\n/g, "\n") : undefined,
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
  }

  return admin
    .auth()
    .verifyIdToken(token)
    .catch(error => {
      throw error;
    });
};
