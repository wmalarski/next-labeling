# Next Labeling

## Environment Variables

### .env

```html
# .env # == Firebase app keys (staging) == FIREBASE_API_KEY=■■■■■■■■-■■■■■■■■
FIREBASE_AUTH_DOMAIN=■■■■■■■■.firebaseapp.com
FIREBASE_DATABASE_URL=https://■■■■■■■■.firebaseio.com
FIREBASE_PROJECT_ID=■■■■■■■■ FIREBASE_STORAGE_BUCKET=■■■■■■■■.appspot.com
FIREBASE_MESSAGING_SENDER_ID=■■■■■■■■ FIREBASE_APP_ID=1:■■■■■■■■:web:■■■■■■■■
FIREBASE_MEASUREMENT_ID=G-■■■■■■■■
```

### .env.build

```html
# .env.build # == Firebase app keys (staging) ==
FIREBASE_API_KEY=■■■■■■■■-■■■■■■■■ FIREBASE_AUTH_DOMAIN=■■■■■■■■.firebaseapp.com
FIREBASE_DATABASE_URL=https://■■■■■■■■.firebaseio.com
FIREBASE_PROJECT_ID=■■■■■■■■ FIREBASE_STORAGE_BUCKET=■■■■■■■■.appspot.com
FIREBASE_MESSAGING_SENDER_ID=■■■■■■■■ FIREBASE_APP_ID=1:■■■■■■■■:web:■■■■■■■■
FIREBASE_MEASUREMENT_ID=G-■■■■■■■■ # == Firebase admin keys (from
serviceAccount-staging.json) ==
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-■■■■@■■■■■■■■.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n■■■■■■■■\n-----END PRIVATE
KEY-----\n
```

## Production environment

Now, we'll configure the project's production environment with keys from Firebase.

Open your **production** project in the Firebase console, and follow the same steps as above:

1. Download your **admin keys** to `/functions/serviceAccount-production.json`
2. Find your **app keys** in the Firebase console's Project settings page.

Run the following commands to add your production Firebase keys to Now:

```
now secrets add firebase-api-key ■■■■■■■■-■■■■■■■■

now secrets add firebase-auth-domain ■■■■■■■■.firebaseapp.com

now secrets add firebase-database-url https://■■■■■■■■.firebaseio.com

now secrets add firebase-project-id ■■■■■■■■

now secrets add firebase-storage-bucket ■■■■■■■■.appspot.com

now secrets add firebase-messaging-sender-id ■■■■■■■■

now secrets add firebase-app-id 1:■■■■■■■■:web:■■■■■■■■

now secrets add firebase-measurement-id G-■■■■■■■■

now secrets add firebase-client-email firebase-adminsdk-■■■■@■■■■■■■■.iam.gserviceaccount.com

now secrets add -- firebase-private-key "-----BEGIN PRIVATE KEY-----\n■■■■■■■■\n-----END PRIVATE KEY-----\n"
```
