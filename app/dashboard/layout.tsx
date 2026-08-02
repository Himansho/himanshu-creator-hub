import DashboardNav from "@/components/dashboard/DashboardNav";
import { ToastProvider } from "@/components/dashboard/Toast";
import { getAdminClaims } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth is re-verified here, next to the data — middleware alone is
  // never trusted (PRD §12).
  const claims = await getAdminClaims();
  if (!claims) redirect("/login");

  return (
    <ToastProvider>
      <div className="min-h-screen">
        <DashboardNav />
        <main className="mx-auto max-w-5xl px-5 py-10">{children}</main>
      </div>
    </ToastProvider>
  );
}
