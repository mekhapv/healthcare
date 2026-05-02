# CareOps Cloud

B2B healthcare SaaS UI assignment built with React, TypeScript, Zustand, Firebase Authentication hooks, Recharts, and a service worker notification use case.

## Run Locally

```bash
npm install
npm run dev
```

Local demo login works without Firebase config:

```text
demo@careops.io
CareOps@123
```

## Firebase Auth

Create a `.env` file with:

```text
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_app_id
```

When those variables are present, login uses `signInWithEmailAndPassword` from Firebase Authentication. Without them, the app uses the demo session so reviewers can still test the UI.

## Features

- Protected login flow with validation, loading, errors, and persisted session state
- Dashboard, analytics, and patient details routes
- Patient grid/list toggle with selected patient details
- Zustand app store for session, view mode, selected patient, and notification count
- Service worker registration and a working local notification action
- Responsive UI and reusable components
