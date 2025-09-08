import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";

export default async function handler(req, res) {
  const session = await getIronSession(req, res, sessionOptions);

  if (!session.strava) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const { accessToken } = session.strava;

  try {
    // Fetch the user's activities
    const response = await fetch(
      "https://www.strava.com/api/v3/athlete/activities?per_page=200",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Failed to fetch activities" });
    }

    const activities = await response.json();

    // Filter only cycling activities
    const rides = activities.filter((a) => a.type === "Ride");

    res.status(200).json(rides);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error fetching activities" });
  }
}
