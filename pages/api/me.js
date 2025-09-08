import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";

export default async function handler(req, res) {
  const session = await getIronSession(req, res, sessionOptions);

  if (!session.strava) {
    return res.status(401).json({ error: "Not logged in" });
  }

  const { athlete } = session.strava;
  res.status(200).json({
    firstname: athlete.firstname,
    profile: athlete.profile,
  });
}
