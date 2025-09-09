import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";
import { cookies } from "next/headers";

export async function GET() {
  // get session from cookies
  const session = await getIronSession(cookies(), sessionOptions);

  if (!session.strava) {
    return Response.json({ error: "Not logged in" }, { status: 401 });
  }

  const { athlete } = session.strava;
  return Response.json({
    firstname: athlete.firstname,
    profile: athlete.profile,
  });
}
