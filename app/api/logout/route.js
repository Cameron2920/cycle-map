import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";
import { cookies } from "next/headers";

export async function GET() {
  const session = await getIronSession(cookies(), sessionOptions);
  session.destroy();
  return Response.json({ success: true });
}
