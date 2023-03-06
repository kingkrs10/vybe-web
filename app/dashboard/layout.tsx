import Menu from "@/components/layout/menu";
import Sidebar from "@/components/layout/sidebar";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: // session,
{
  children: React.ReactNode;
  session: any;
}) {
  // if (localStorage.getItem("session") === undefined) {
  const session = await getCurrentUser();
  // localStorage.setItem("session", JSON.stringify(session));
  // }
  // const session = localStorage.getItem("session");
  // console.log(session);
  // const path = usePathname();
  if (session === undefined /*&& path == "/dashboard/events/new"*/) {
    redirect("/login?redirect=/dashboard/events");
  }
  return (
    <>
      {session !== undefined && (
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
