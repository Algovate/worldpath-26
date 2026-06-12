import { OverviewDashboard } from "@/features/overview/overview-dashboard";
import { getTournamentSnapshot } from "@/lib/tournament/snapshot";

export default async function Home() {
  return <OverviewDashboard initialSnapshot={await getTournamentSnapshot()} />;
}
