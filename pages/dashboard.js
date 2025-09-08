import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";
import ActivitiesMap from "@/components/ActivitiesMap";
import UserMenu from "../components/UserMenu";

export async function getServerSideProps({ req, res }) {
  const session = await getIronSession(req, res, sessionOptions);
  const user = session.strava || null;

  if (!user) {
    return {
      redirect: { destination: "/", permanent: false },
    };
  }

  return { props: { user } };
}

export default function Dashboard({ user }) {
  async function handleLogout() {
    await fetch("/api/logout");
    window.location.href = "/";
  }

  return (
    <div className="relative w-screen h-screen">
      <ActivitiesMap />
      <UserMenu />
    </div>
  );
}
