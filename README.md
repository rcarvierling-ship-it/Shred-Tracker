# Shred Tracker

A private, modern workout tracking web app optimized for machines-only workouts.

## Features
- **Private Access**: Secured via Firebase Auth with a strict email allowlist.
- **Machine-Focused**: Pre-loaded with a specific 5-day machine workout split.
- **Smart Logging**: Tracks sets, reps, and RPE with auto-starting rest timer.
- **Analytics**: Visual progress charts for every exercise.
- **Export**: Download your data as CSV.

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   Copy `.env.local.example` to `.env.local` and fill in your Firebase config:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_ALLOWED_EMAIL=your@email.com
   ```

3. **Run Locally**
   ```bash
   npm run dev
   ```

## Deployment (Vercel)

1. Push this code to a private GitHub repository.
2. Connect the repo to Vercel.
3. Add the environment variables from your `.env.local` to the Vercel project settings.
4. Deploy!

## Firebase Setup

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com).
2. Enable **Authentication** and turn on **Email/Password** provider.
3. Enable **Firestore Database** in **Production Mode**.
4. Copy the Rules from `firestore.rules` in this repo to your Firestore Rules tab.
5. Get your web app config from Project Settings and add to `.env.local`.

## First Run
On the first login, you will see a "Reset/Seed Data" button on the dashboard. Click it to populate the default workout plan.
