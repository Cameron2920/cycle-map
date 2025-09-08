"use client";

import Link from "next/link";
import {useEffect, useState} from "react";
import Image from "next/image";

export default function Home() {
  const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID;
  const [redirectUri, setRedirectUri] = useState(process.env.NEXT_PUBLIC_STRAVA_REDIRECT_URI);

  useEffect(() => {
    if(!redirectUri) {
      setRedirectUri(`${window.location.protocol}//${window.location.host}/api/auth/strava/callback`);
    }
  }, []);

  const authUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&approval_prompt=force&scope=read,activity:read`;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      {/* Hero Section */}
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
          Cycle Log
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 mb-8">
          Visualize all your cycling activities from Strava on a full-screen interactive map. Track your rides, see your routes, and get a clear overview of your cycling history.
        </p>

        {/*Mandatory Strava Button*/}
        <div className="mb-8 flex justify-center">
          <a
            href={authUrl} >
            <Image
              src="/btn_strava_connect_with_orange_x2.png"
              alt="Connect with Strava"
              width={192} height={48}
            />
          </a>
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-16 grid gap-10 sm:grid-cols-2 md:grid-cols-3 max-w-5xl">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h2 className="font-semibold text-xl mb-2">Interactive Maps</h2>
          <p className="text-gray-600">View your rides on a full-screen map with all routes plotted.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h2 className="font-semibold text-xl mb-2">Track Your Progress</h2>
          <p className="text-gray-600">Easily see where and how far you’ve cycled over time.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h2 className="font-semibold text-xl mb-2">Quick Access</h2>
          <p className="text-gray-600">Login with Strava and instantly access your cycling history.</p>
        </div>
      </div>

      {/* Mandatory Strava Disclaimer */}
      <div className="text-sm text-gray-600 mt-4">
        <Image
          src="/api_logo_pwrdBy_strava_horiz_orange.png"
          alt="Powered by Strava"
          width={120}
          height={24}
          className="inline-block ml-2"
        />
      </div>
    </div>
  );
}
