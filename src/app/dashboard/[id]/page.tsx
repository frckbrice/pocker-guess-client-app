import DashboardRoomClient from "../../../components/dashboard/DashboardRoomClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Game Room",
  description: "Play and manage a live PockerPlay game room.",
};

type PageProps = {
  params: Promise<{ id: string }> | { id: string };
};

/**
 * Server page entry for the game room route.
 * Resolves dynamic params and renders the room client shell.
 */
export default async function DashboardRoomPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <DashboardRoomClient gameId={resolvedParams.id} />;
}
