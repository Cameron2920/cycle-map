import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";

export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: "Missing code" });
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
      return res.status(400).json(data);
    }

    const session = await getIronSession(req, res, sessionOptions);

    session.strava = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: data.expires_at,
      athlete: data.athlete,
    };

    await session.save();

    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to exchange token" });
  }
}
