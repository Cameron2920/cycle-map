# Cycle Log 🚴‍♂️

Cycle Log is a web app that visualizes your cycling activities from [Strava](https://www.strava.com) on an interactive map.  
You can explore your ride history, view routes, and get a clear overview of where you’ve cycled.

👉 **[Try it out here](https://cycle-map.vercel.app/dashboard?mode=demo)** 👈 (NOTE: You will only be able to use the demo mode since this app has not yet been approved by Strava.)

---

## ✨ Features
- 📍 **Interactive Maps** – All of your rides plotted on a full-screen, zoomable map.
- 📊 **Ride Overview** – See distances, durations, and dates for your activities.
- 🔑 **Strava Integration** – Connect with Strava to pull in your personal ride data.
- 🧪 **Demo Mode** – Try out the app without a Strava account using sample rides.

---

## Development

This is a Next.js app. 

### Prerequisites
- Node.js (>= 18 recommended)
- A Strava developer account + API credentials (for live mode)
- A mapbox account

### Getting Started

Install dependencies

```bash
npm install
```

Setup environment variables

```bash
cp env.local.example .env.local
```

You will need to fill in the variable values in .env.local. 
SESSION_SECRET should be a random string.

Then run the development server:

```bash
npm run dev
```

And then open [http://localhost:3000](http://localhost:3000).

### Deployment

This app is automatically deployed on Vercel whenever pushed to the main the branch.
