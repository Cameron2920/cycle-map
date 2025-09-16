// app/dashboard/page.jsx
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions } from "@/lib/session";
import { redirect } from "next/navigation";
import ActivitiesMap from "@/components/ActivitiesMap";
import UserMenu from "@/components/UserMenu";

export default async function DashboardPage({ searchParams }) {
  let isDemo = searchParams.mode == "demo";
  let user = null;

  if(!isDemo) {
    const session = await getIronSession(cookies(), sessionOptions);
    user = session.strava;

    if (!user) {
      redirect("/");
    }
  }
  console.log("searchParams", searchParams.mode, isDemo);

  return (
    <div className="relative w-screen h-screen">
      <ActivitiesMap isDemo={isDemo}/>
      <UserMenu user={user} isDemo={isDemo} />
    </div>
  );
}
