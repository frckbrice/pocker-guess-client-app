import type { Metadata } from "next";
import DashboardCreateGameClient from "@/components/dashboard/DashboardCreateGameClient";

export const metadata: Metadata = {
  title: "Dashboard | Create Game",
  description: "Create and start a new PockerPlay game session.",
};

/**
 * Server page entry for dashboard home.
 * Delegates interactive behavior to a dedicated client component.
 */
export default function DashboardPage() {
  return <DashboardCreateGameClient />;
}
