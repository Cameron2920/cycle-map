"use client"; // needed for interactivity

import { useState, useEffect } from "react";

export default function UserMenu({isDemo}) {
  const [user, setUser] = useState(null);

  async function fetchUser() {
    if(isDemo) {
      setUser({
        firstname: "Demo",
        profile: "https://dgalywyr863hv.cloudfront.net/pictures/strava_o_auth/applications/175875/40219028/2/medium.jpg"
      })
    }
    else{
      const res = await fetch("/api/me");

      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  async function handleLogout() {
    if(!isDemo) {
      await fetch("/api/logout");
    }
    window.location.href = "/"; // redirect home
  }

  if (!user) return null;

  return (
    <div className="absolute top-4 right-4 flex items-center gap-3 bg-white bg-opacity-90 px-3 py-2 rounded-lg shadow-md z-10">
      <img
        src={user.profile}
        alt={user.firstname}
        className="w-10 h-10 rounded-full border border-gray-300"
      />
      <span className="font-semibold">{user.firstname}</span>
      <button
        onClick={handleLogout}
        className="ml-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}
