import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  try {
    const response = await fetch("https://www.strava.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
      }),
    });

    const data = await response.json();

    if (data.errors) {
      return NextResponse.json(data, { status: 400 });
    }

    // Attach session to cookies
    const session = await getIronSession(cookies(), sessionOptions);

    session.strava = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: data.expires_at,
      athlete: data.athlete,
    };

    await session.save();

    // Redirect to dashboard
    return NextResponse.redirect(new URL("/dashboard", req.url));
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to exchange token" }, { status: 500 });
  }
}
