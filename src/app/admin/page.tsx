import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminDashboardClient from "./AdminDashboardClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Moderation Portal — KMCLU Confessions",
  description: "Protected administrative moderation portal for KMCLU confessions.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/admin/login");
  }

  return <AdminDashboardClient adminEmail={session.user.email || "Admin"} />;
}
