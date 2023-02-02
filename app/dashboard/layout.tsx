import Menu from "../../components/layout/menu";
import Sidebar from "../../components/layout/sidebar";
import { getSession, getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { useRouter, usePathname } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  // const path = usePathname();
  if (session == null /*&& path == "/dashboard/events/new"*/) {
    redirect("/login?redirect=/dashboard/events/");
  }
  return (
    <>
      {session != null && (
        <div>
          <Sidebar />
          <div className="md:pl-64">
            <Menu />
            <div className="mx-auto flex max-w-4xl flex-col md:px-8 xl:px-0">
              <div className="px-4 py-4">{children}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
