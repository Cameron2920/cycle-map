// app/dashboard/page.jsx
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions } from "@/lib/session";
import { redirect } from "next/navigation";
import ActivitiesMap from "@/components/ActivitiesMap";
import UserMenu from "@/components/UserMenu";

export default async function DashboardPage() {
  const session = await getIronSession(cookies(), sessionOptions);
  const user = session.strava || null;

  if (!user) {
    redirect("/");
  }

  return (
    <div className="relative w-screen h-screen">
      <ActivitiesMap />
      <UserMenu user={user} />
    </div>
  );
}
