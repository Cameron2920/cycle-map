import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";
import { cookies } from "next/headers";

export async function GET() {
  // get session from cookies
  const session = await getIronSession(cookies(), sessionOptions);

  if (!session.strava) {
    return Response.json({ error: "Not logged in" }, { status: 401 });
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
      return Response.json({ error: "Failed to fetch activities" }, { status: response.status });
    }

    const activities = await response.json();

    // Filter only cycling activities
    const rides = activities.filter((a) => a.type === "Ride");

    return Response.json(rides);
  }
  catch (err) {
    console.error(err);
    return Response.json({ error: "Server error fetching activities" }, { status: 500 });
  }
}
